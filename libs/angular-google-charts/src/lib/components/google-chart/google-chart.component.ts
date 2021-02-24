import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  SimpleChanges
} from '@angular/core';
import { fromEvent, Observable, ReplaySubject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { DataTableService } from '../../services/data-table.service';
import { ScriptLoaderService } from '../../services/script-loader.service';
import { ChartType } from '../../types/chart-type';
import {
  ChartErrorEvent,
  ChartMouseLeaveEvent,
  ChartMouseOverEvent,
  ChartReadyEvent,
  ChartSelectionChangedEvent
} from '../../types/events';
import { Formatter } from '../../types/formatter';
import { ChartBase, Column, Row } from '../chart-base/chart-base.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'google-chart',
  template: '',
  styles: [':host { width: fit-content; display: block; }'],
  host: { class: 'google-chart' },
  exportAs: 'googleChart',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleChartComponent implements ChartBase, OnChanges, OnInit {
  /**
   * The type of the chart to create.
   */
  @Input()
  public type!: ChartType;

  /**
   * Data used to initialize the table.
   *
   * This must also contain all roles that are set in the `columns` property.
   */
  @Input()
  public data!: Row[];

  /**
   * The columns the `data` consists of.
   * The length of this array must match the length of each row in the `data` object.
   *
   * If {@link https://developers.google.com/chart/interactive/docs/roles roles} should be applied, they must be included in this array as well.
   */
  @Input()
  public columns?: Column[];

  /**
   * A convenience property used to set the title of the chart.
   *
   * This can also be set using `options.title`, which, if existant, will overwrite this value.
   */
  @Input()
  public title?: string;

  /**
   * A convenience property used to set the width of the chart in pixels.
   *
   * This can also be set using `options.width`, which, if existant, will overwrite this value.
   */
  @Input()
  public width?: number;

  /**
   * A convenience property used to set the height of the chart in pixels.
   *
   * This can also be set using `options.height`, which, if existant, will overwrite this value.
   */
  @Input()
  public height?: number;

  /**
   * The chart-specific options. All options listen in the Google Charts documentation applying
   * to the chart type specified can be used here.
   */
  @Input()
  public options: object = {};

  /**
   * Used to change the displayed value of the specified column in all rows.
   *
   * Each array element must consist of an instance of a [`formatter`](https://developers.google.com/chart/interactive/docs/reference#formatters)
   * and the index of the column you want the formatter to get applied to.
   */
  @Input()
  public formatters?: Formatter[];

  /**
   * If this is set to `true`, the chart will be redrawn if the browser window is resized.
   * Defaults to `false` and should only be used when specifying the width or height of the chart
   * in percent.
   *
   * Note that this can impact performance.
   */
  @Input()
  public dynamicResize = false;

  @Output()
  public ready = new EventEmitter<ChartReadyEvent>();

  @Output()
  public error = new EventEmitter<ChartErrorEvent>();

  @Output()
  public select = new EventEmitter<ChartSelectionChangedEvent>();

  @Output()
  public mouseover = new EventEmitter<ChartMouseOverEvent>();

  @Output()
  public mouseleave = new EventEmitter<ChartMouseLeaveEvent>();

  private resizeSubscription?: Subscription;

  private dataTable: google.visualization.DataTable | undefined;
  private wrapper: google.visualization.ChartWrapper | undefined;
  private wrapperReadySubject = new ReplaySubject<google.visualization.ChartWrapper>(1);
  private initialized = false;

  constructor(
    private element: ElementRef,
    private scriptLoaderService: ScriptLoaderService,
    private dataTableService: DataTableService,
    @Optional() private dashboard?: DashboardComponent
  ) {}

  public get chart(): google.visualization.ChartBase | null {
    return this.chartWrapper.getChart();
  }

  public get wrapperReady$(): Observable<google.visualization.ChartWrapper> {
    return this.wrapperReadySubject.asObservable();
  }

  public get chartWrapper(): google.visualization.ChartWrapper {
    if (!this.wrapper) {
      throw new Error('Trying to access the chart wrapper before it was fully initialized');
    }

    return this.wrapper;
  }

  public set chartWrapper(wrapper: google.visualization.ChartWrapper) {
    this.wrapper = wrapper;
    this.drawChart();
  }

  public ngOnInit() {
    // We don't need to load any chart packages, the chart wrapper will handle this for us
    this.scriptLoaderService.loadChartPackages().subscribe(() => {
      this.dataTable = this.dataTableService.create(this.data, this.columns, this.formatters);

      // Only ever create the wrapper once to allow animations to happen when someting changes.
      this.wrapper = new google.visualization.ChartWrapper({
        container: this.element.nativeElement,
        chartType: this.type,
        dataTable: this.dataTable,
        options: this.mergeOptions()
      });

      this.registerChartEvents();

      this.wrapperReadySubject.next(this.wrapper);
      this.initialized = true;

      this.drawChart();
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.dynamicResize) {
      this.updateResizeListener();
    }

    if (this.initialized) {
      let shouldRedraw = false;
      if (changes.data || changes.columns || changes.formatters) {
        this.dataTable = this.dataTableService.create(this.data, this.columns, this.formatters);
        this.wrapper!.setDataTable(this.dataTable!);
        shouldRedraw = true;
      }

      if (changes.type) {
        this.wrapper!.setChartType(this.type);
        shouldRedraw = true;
      }

      if (changes.options || changes.width || changes.height || changes.title) {
        this.wrapper!.setOptions(this.mergeOptions());
        shouldRedraw = true;
      }

      if (shouldRedraw) {
        this.drawChart();
      }
    }
  }

  private updateResizeListener() {
    if (this.resizeSubscription != null) {
      this.resizeSubscription.unsubscribe();
      this.resizeSubscription = undefined;
    }

    if (this.dynamicResize) {
      this.resizeSubscription = fromEvent(window, 'resize')
        .pipe(debounceTime(100))
        .subscribe(() => {
          if (this.initialized) {
            this.drawChart();
          }
        });
    }
  }

  private mergeOptions(): object {
    return {
      title: this.title,
      width: this.width,
      height: this.height,
      ...this.options
    };
  }

  private registerChartEvents() {
    google.visualization.events.removeAllListeners(this.wrapper);

    const registerChartEvent = (object: any, eventName: string, callback: Function) => {
      google.visualization.events.addListener(object, eventName, callback);
    };

    registerChartEvent(this.wrapper, 'ready', () => {
      // This could also be done by checking if we already subscribed to the events
      google.visualization.events.removeAllListeners(this.chart);
      registerChartEvent(this.chart, 'onmouseover', (event: ChartMouseOverEvent) => this.mouseover.emit(event));
      registerChartEvent(this.chart, 'onmouseout', (event: ChartMouseLeaveEvent) => this.mouseleave.emit(event));
      registerChartEvent(this.chart, 'select', () => {
        const selection = this.chart!.getSelection();
        this.select.emit({ selection });
      });

      this.ready.emit({ chart: this.chart! });
    });

    registerChartEvent(this.wrapper, 'error', (error: ChartErrorEvent) => this.error.emit(error));
  }

  private drawChart() {
    if (this.dashboard != null) {
      // If this chart is part of a dashboard, the dashboard takes care of drawing
      return;
    }

    this.wrapper!.draw();
  }
}
