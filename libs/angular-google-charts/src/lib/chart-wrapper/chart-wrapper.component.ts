import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { getPackageForChart } from '../helpers/chart.helper';
import { ChartBase } from '../models/chart-base.model';
import { ChartType } from '../models/chart-type.model';
import { ChartErrorEvent, ChartReadyEvent, ChartSelectionChangedEvent } from '../models/events.model';
import { ScriptLoaderService } from '../script-loader/script-loader.service';

@Component({
  selector: 'chart-wrapper',
  template: '',
  styles: [':host { width: fit-content; display: block; }'],
  host: { class: 'chart-wrapper' },
  exportAs: 'chart-wrapper',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartWrapperComponent implements ChartBase, OnChanges {
  /**
   * Either a JSON object defining the chart, or a serialized string version of that object.
   * The format of this object is shown in the
   * {@link https://developers.google.com/chart/interactive/docs/reference#google.visualization.drawchart `drawChart()`} documentation.
   *
   * The `container` and `containerId` will be overwritten by this component to allow
   * rendering the chart into the components' template.
   */
  @Input()
  public specs: google.visualization.ChartSpecs;

  @Output()
  public error = new EventEmitter<ChartErrorEvent>();

  @Output()
  public ready = new EventEmitter<ChartReadyEvent>();

  @Output()
  public select = new EventEmitter<ChartSelectionChangedEvent>();

  private wrapper: google.visualization.ChartWrapper;

  constructor(private element: ElementRef, private loaderService: ScriptLoaderService) {}

  public get chart(): google.visualization.ChartBase | null {
    if (!this.wrapper) {
      return null;
    }

    return this.wrapper.getChart();
  }

  /**
   * The underlying chart wrapper of this component or `null`.
   */
  public get chartWrapper(): google.visualization.ChartWrapper | null {
    return this.wrapper;
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.specs) {
      this.createChart();
    }
  }

  private createChart() {
    this.loadNeededPackages().subscribe(() => {
      this.createWrapper();
    });
  }

  private loadNeededPackages(): Observable<void> {
    return this.loaderService.loadChartPackages(getPackageForChart(this.specs.chartType as ChartType));
  }

  private createWrapper() {
    const { container, containerId, ...chartSpecs } = this.specs;
    this.wrapper = new google.visualization.ChartWrapper(chartSpecs);

    this.registerChartEvents();

    this.wrapper.draw(this.element.nativeElement);
  }

  private registerChartEvents() {
    google.visualization.events.removeAllListeners(this.wrapper);

    const registerChartEvent = (object: any, eventName: string, callback: Function) => {
      google.visualization.events.addListener(object, eventName, callback);
    };

    registerChartEvent(this.wrapper, 'ready', () => this.ready.emit({ chart: this.chart }));
    registerChartEvent(this.wrapper, 'error', (error: ChartErrorEvent) => this.error.emit(error));
    registerChartEvent(this.wrapper, 'select', () => {
      const selection = this.chart.getSelection();
      this.select.emit({ selection });
    });
  }
}
