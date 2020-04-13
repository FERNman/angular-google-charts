/// <reference types="google.visualization"/>

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
import { fromEvent, ReplaySubject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ChartType } from '../../models/chart-type.model';
import {
  ChartErrorEvent,
  ChartMouseLeaveEvent,
  ChartMouseOverEvent,
  ChartReadyEvent,
  ChartSelectionChangedEvent
} from '../../models/events.model';
import { ScriptLoaderService } from '../../script-loader/script-loader.service';
import { ChartBase, Column, Row } from '../chart-base/chart-base.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

export interface Formatter {
  formatter: google.visualization.DefaultFormatter;
  colIndex: number;
}

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
  public columns: Column[];

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

  private dataTable: google.visualization.DataTable;
  private resizeSubscription: Subscription;

  private wrapper: google.visualization.ChartWrapper;
  private wrapperReadySubject = new ReplaySubject<google.visualization.ChartWrapper>(1);
  private initialized = false;

  constructor(
    private element: ElementRef,
    private scriptLoaderService: ScriptLoaderService,
    @Optional() private dashboard?: DashboardComponent
  ) {}

  public get chart(): google.visualization.ChartBase | null {
    if (!this.wrapper) {
      return null;
    }

    return this.wrapper.getChart();
  }

  public get wrapperReady$() {
    return this.wrapperReadySubject.asObservable();
  }

  public get chartWrapper(): google.visualization.ChartWrapper | null {
    return this.wrapper;
  }

  public ngOnInit() {
    // We don't need to load any chart packages, the chart wrapper will handle this for us
    this.scriptLoaderService.loadChartPackages().subscribe(() => {
      // Only ever create the wrapper once to allow animations to happen when someting changes.
      this.wrapper = new google.visualization.ChartWrapper({
        chartType: this.type,
        container: this.element.nativeElement
      });

      this.createDataTable();
      this.createChart();

      this.initialized = true;
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.dynamicResize) {
      this.updateResizeListener();
    }

    if (this.initialized) {
      const dataChanged = changes.data || changes.columns;
      if (dataChanged) {
        this.createDataTable();
      }

      if (dataChanged || changes.options || changes.type || changes.width || changes.height || changes.title || changes.formatters) {
        this.createChart();
      }
    }
  }

  private createDataTable() {
    if (this.data == null) {
      return;
    }

    let firstRowIsData = true;
    if (this.columns != null) {
      firstRowIsData = false;
    }

    this.dataTable = google.visualization.arrayToDataTable(this.getDataAsTable(), firstRowIsData);
  }

  private getDataAsTable(): (Row | Column[])[] {
    if (this.columns) {
      return [this.columns, ...this.data];
    } else {
      return this.data;
    }
  }

  private updateResizeListener() {
    if (this.resizeSubscription != null) {
      this.resizeSubscription.unsubscribe();
      this.resizeSubscription = null;
    }

    if (this.dynamicResize) {
      this.resizeSubscription = fromEvent(window, 'resize')
        .pipe(debounceTime(100))
        .subscribe(() => {
          if (this.initialized) {
            this.redrawChart();
          }
        });
    }
  }

  private createChart() {
    this.wrapper.setChartType(this.type);
    this.wrapper.setDataTable(this.dataTable);
    this.applyFormatters(this.dataTable);

    const mergedOptions = this.mergeOptions();
    this.wrapper.setOptions(mergedOptions);

    this.registerChartEvents();

    this.wrapperReadySubject.next(this.wrapper);
    this.redrawChart();
  }

  private mergeOptions(): object {
    return {
      title: this.title,
      width: this.width,
      height: this.height,
      ...this.options
    };
  }

  private applyFormatters(dataTable: google.visualization.DataTable): void {
    if (this.formatters == null) {
      return;
    }

    for (const val of this.formatters) {
      val.formatter.format(dataTable, val.colIndex);
    }
  }

  private registerChartEvents() {
    google.visualization.events.removeAllListeners(this.wrapper);

    const registerChartEvent = (object: any, eventName: string, callback: Function) => {
      google.visualization.events.addListener(object, eventName, callback);
    };

    registerChartEvent(this.wrapper, 'ready', () => {
      registerChartEvent(this.chart, 'onmouseover', (event: ChartMouseOverEvent) => this.mouseover.emit(event));
      registerChartEvent(this.chart, 'onmouseout', (event: ChartMouseLeaveEvent) => this.mouseleave.emit(event));

      this.ready.emit({ chart: this.chart });
    });

    registerChartEvent(this.wrapper, 'error', (error: ChartErrorEvent) => this.error.emit(error));
    registerChartEvent(this.wrapper, 'select', () => {
      const selection = this.chart.getSelection();
      this.select.emit({ selection });
    });
  }

  private redrawChart() {
    if (this.dashboard != null) {
      // If this chart is part of a dashboard, the dashboard takes care of drawing
      return;
    }

    this.wrapper.draw(this.element.nativeElement);
  }
}
