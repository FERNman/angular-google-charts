/// <reference types="google.visualization"/>

import {
  Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ElementRef, OnInit, OnChanges, AfterViewInit
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
  rawData: google.visualization.ChartSpecs;

  @Input()
  formatter: any | Array<{ formatter: any, colIndex: number }>;

  @Input()
  dynamicResize = false;

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

  constructor(
    protected element: ElementRef,
    protected loaderService: ScriptLoaderService
  ) { }

  ngOnInit() {
    if (this.rawData == null) { throw new Error('Can\'t create a Google Chart without data!'); }

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

  protected createChart() {
    this.loadNeededPackages().subscribe(() => {
      this.wrapper = new google.visualization.ChartWrapper();
      this.updateChart();
    });
  }

  protected loadNeededPackages(): Observable<any> {
    return this.loaderService.loadChartPackages([GoogleChartPackagesHelper.getPackageForChartName(this.rawData.chartType)]);
  }

  protected updateChart() {
    if (this.rawData.dataTable) {
      this.formatData(<google.visualization.DataTable>this.rawData.dataTable);
    }

    this.wrapper.setChartType(this.rawData.chartType);
    this.wrapper.setDataTable(<google.visualization.DataTable>this.rawData.dataTable);
    this.wrapper.setOptions(this.rawData.options);
    this.wrapper.setDataSourceUrl(this.rawData.dataSourceUrl);
    this.wrapper.setQuery(this.rawData.query);
    this.wrapper.setRefreshInterval(this.rawData.refreshInterval);
    this.wrapper.setView(this.rawData.view);

    this.removeChartEvents();
    this.registerChartEvents();

    this.wrapper.draw(this.element.nativeElement);
  }

  protected formatData(dataTable: google.visualization.DataTable) {
    if (!this.formatter) {
      return;
    }

    if (this.formatter instanceof Array) {
      this.formatter.forEach((value) => {
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
    this.registerChartEvent('ready', () => this.ready.emit('Chart Ready'));
    this.registerChartEvent('error', (error) => this.error.emit(error));
    this.registerChartEvent('select', () => {
      const selection = this.wrapper.getChart().getSelection();
      this.select.emit(selection);
    });

    this.registerChartEvent('onmouseover', (event) => this.mouseenter.emit(event));
    this.registerChartEvent('onmouseout', (event) => this.mouseleave.emit(event));
  }

  private registerChartEvent(eventName: string, callback: Function) {
    google.visualization.events.addListener(this.wrapper, eventName, callback);
  }
}
