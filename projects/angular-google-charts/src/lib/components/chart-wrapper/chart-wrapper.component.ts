import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { ScriptLoaderService } from '../../services/script-loader.service';
import { ChartErrorEvent, ChartReadyEvent, ChartSelectionChangedEvent } from '../../types/events';
import { ChartBase } from '../chart-base/chart-base.component';

@Component({
  selector: 'chart-wrapper',
  template: '',
  styles: [':host { width: fit-content; display: block; }'],
  host: { class: 'chart-wrapper' },
  exportAs: 'chartWrapper',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartWrapperComponent implements ChartBase, OnChanges, OnInit {
  /**
   * Either a JSON object defining the chart, or a serialized string version of that object.
   * The format of this object is shown in the
   * {@link https://developers.google.com/chart/interactive/docs/reference#google.visualization.drawchart `drawChart()`} documentation.
   *
   * The `container` and `containerId` will be overwritten by this component to allow
   * rendering the chart into the components' template.
   */
  @Input()
  public specs?: google.visualization.ChartSpecs;

  @Output()
  public error = new EventEmitter<ChartErrorEvent>();

  @Output()
  public ready = new EventEmitter<ChartReadyEvent>();

  @Output()
  public select = new EventEmitter<ChartSelectionChangedEvent>();

  private wrapper: google.visualization.ChartWrapper | undefined;
  private wrapperReadySubject = new ReplaySubject<google.visualization.ChartWrapper>(1);
  private initialized = false;

  constructor(private element: ElementRef, private scriptLoaderService: ScriptLoaderService) {}

  public get chart(): google.visualization.ChartBase | null {
    return this.chartWrapper.getChart();
  }

  public get wrapperReady$() {
    return this.wrapperReadySubject.asObservable();
  }

  public get chartWrapper(): google.visualization.ChartWrapper {
    if (!this.wrapper) {
      throw new Error('Cannot access the chart wrapper before initialization.');
    }

    return this.wrapper;
  }

  public set chartWrapper(wrapper: google.visualization.ChartWrapper) {
    this.wrapper = wrapper;
    this.drawChart();
  }

  public ngOnInit() {
    // We don't need to load any chart packages, the chart wrapper will handle this else for us
    this.scriptLoaderService.loadChartPackages().subscribe(() => {
      if (!this.specs) {
        this.specs = {} as google.visualization.ChartSpecs;
      }

      const { containerId, container, ...specs } = this.specs;

      // Only ever create the wrapper once to allow animations to happen if something changes.
      this.wrapper = new google.visualization.ChartWrapper({
        ...specs,
        container: this.element.nativeElement
      });
      this.registerChartEvents();

      this.wrapperReadySubject.next(this.wrapper);

      this.drawChart();
      this.initialized = true;
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (!this.initialized) {
      return;
    }

    if (changes.specs) {
      this.updateChart();
      this.drawChart();
    }
  }

  private updateChart() {
    if (!this.specs) {
      // When creating the wrapper with empty specs, the google charts library will show an error
      // If we don't do this, a javascript error will be thrown, which is not as visible to the user
      this.specs = {} as google.visualization.ChartSpecs;
    }

    // The typing here are not correct. These methods accept `undefined` as well.
    // That's why we have to cast to `any`

    this.wrapper!.setChartType(this.specs.chartType);
    this.wrapper!.setDataTable(this.specs.dataTable as any);
    this.wrapper!.setDataSourceUrl(this.specs.dataSourceUrl as any);
    this.wrapper!.setDataSourceUrl(this.specs.dataSourceUrl as any);
    this.wrapper!.setQuery(this.specs.query as any);
    this.wrapper!.setOptions(this.specs.options as any);
    this.wrapper!.setRefreshInterval(this.specs.refreshInterval as any);
    this.wrapper!.setView(this.specs.view);
  }

  private drawChart() {
    if (this.wrapper) {
      this.wrapper.draw();
    }
  }

  private registerChartEvents() {
    google.visualization.events.removeAllListeners(this.wrapper);

    const registerChartEvent = (object: any, eventName: string, callback: Function) => {
      google.visualization.events.addListener(object, eventName, callback);
    };

    registerChartEvent(this.wrapper, 'ready', () => this.ready.emit({ chart: this.chart! }));
    registerChartEvent(this.wrapper, 'error', (error: ChartErrorEvent) => this.error.emit(error));
    registerChartEvent(this.wrapper, 'select', () => {
      const selection = this.chart!.getSelection();
      this.select.emit({ selection });
    });
  }
}
