/// <reference types="google.visualization"/>

import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnInit,
  OnChanges,
  AfterViewInit
} from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ChartErrorEvent, ChartEvent } from '../models/events.model';
import { ScriptLoaderService } from '../script-loader/script-loader.service';
import { GoogleChartPackagesHelper } from '../helpers/google-chart-packages.helper';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'raw-chart',
  template: '',
  styles: [':host { width: fit-content; display: block; }'],
  exportAs: 'raw-chart',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RawChartComponent implements OnInit, OnChanges, AfterViewInit {
  @Input()
  chartData: google.visualization.ChartSpecs;

  @Input()
  formatter:
    | google.visualization.DefaultFormatter
    | Array<{
        formatter: google.visualization.DefaultFormatter;
        colIndex: number;
      }>;

  @Input()
  dynamicResize = false;

  @Input()
  firstRowIsData = false;

  @Output()
  error = new EventEmitter<ChartErrorEvent>();

  @Output()
  ready = new EventEmitter();

  @Output()
  select = new EventEmitter<ChartEvent>();

  @Output()
  mouseenter = new EventEmitter<ChartEvent>();

  @Output()
  mouseleave = new EventEmitter<ChartEvent>();

  wrapper: google.visualization.ChartWrapper;

  private dataTable: google.visualization.DataTable;

  constructor(protected element: ElementRef, protected loaderService: ScriptLoaderService) {}

  ngOnInit() {
    if (this.chartData == null) {
      throw new Error('Can\'t create a Google Chart without data!');
    }

    this.loaderService.onReady.subscribe(() => {
      this.createChart();
    });
  }

  ngAfterViewInit() {
    this.addResizeListener();
  }

  ngOnChanges() {
    if (this.wrapper) {
      this.updateChart();
    }
  }

  public getChartElement(): HTMLElement {
    return this.element.nativeElement.firstElementChild;
  }

  public clearChart(): void {
    this.wrapper && this.wrapper.getChart() && this.wrapper.getChart().clearChart();
  }

  protected createChart() {
    this.loadNeededPackages().subscribe(() => {
      this.wrapper = new google.visualization.ChartWrapper();
      this.updateChart();
    });
  }

  protected loadNeededPackages(): Observable<void> {
    return this.loaderService.loadChartPackages([GoogleChartPackagesHelper.getPackageForChartName(this.chartData.chartType)]);
  }

  protected updateChart() {
    // This check here is important to allow passing of a created dataTable as well as just an array
    if (!(this.chartData.dataTable instanceof google.visualization.DataTable)) {
      this.dataTable = google.visualization.arrayToDataTable(<any[]>this.chartData.dataTable, this.firstRowIsData);
    } else {
      this.dataTable = this.chartData.dataTable;
    }

    this.wrapper.setDataTable(this.dataTable);
    this.wrapper.setChartType(this.chartData.chartType);
    this.wrapper.setOptions(this.chartData.options);
    this.wrapper.setDataSourceUrl(this.chartData.dataSourceUrl);
    this.wrapper.setQuery(this.chartData.query);
    this.wrapper.setRefreshInterval(this.chartData.refreshInterval);
    this.wrapper.setView(this.chartData.view);

    this.removeChartEvents();
    this.registerChartEvents();

    if (this.formatter) {
      this.formatData(this.dataTable);
    }

    this.wrapper.draw(this.element.nativeElement);
  }

  protected formatData(dataTable: google.visualization.DataTable) {
    if (this.formatter instanceof Array) {
      this.formatter.forEach(value => {
        value.formatter.format(dataTable, value.colIndex);
      });
    } else {
      for (let i = 0; i < dataTable.getNumberOfColumns(); i++) {
        this.formatter.format(dataTable, i);
      }
    }
  }

  private addResizeListener() {
    if (this.dynamicResize) {
      fromEvent(window, 'resize')
        .pipe(debounceTime(100))
        .subscribe(() => {
          this.ngOnChanges();
        });
    }
  }

  private removeChartEvents() {
    google.visualization.events.removeAllListeners(this.wrapper);
  }

  private registerChartEvents() {
    this.registerChartEvent(this.wrapper, 'ready', () => {
      this.registerChartEvent(this.wrapper.getChart(), 'onmouseover', event => this.mouseenter.emit(event));
      this.registerChartEvent(this.wrapper.getChart(), 'onmouseout', event => this.mouseleave.emit(event));

      this.ready.emit('Chart Ready');
    });

    this.registerChartEvent(this.wrapper, 'error', error => this.error.emit(error));
    this.registerChartEvent(this.wrapper, 'select', () => {
      const selection = this.wrapper.getChart().getSelection();
      this.select.emit(selection);
    });
  }

  private registerChartEvent(object: any, eventName: string, callback: Function) {
    google.visualization.events.addListener(object, eventName, callback);
  }
}
