/// <reference types="google.visualization"/>

import {
  Component, OnInit, ElementRef, Input, ChangeDetectionStrategy,
  OnChanges, Output, EventEmitter, HostListener
} from '@angular/core';
import { ChartErrorEvent, ChartEvent } from '../models/events.model';
import { ScriptLoaderService } from '../script-loader/script-loader.service';
import { Observable } from 'rxjs';
import { GoogleChartPackagesHelper } from '../helpers/google-chart-packages.helper';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'google-chart',
  template: '',
  styles: [':host { width: fit-content; display: block; }'],
  exportAs: 'google-chart',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleChartComponent implements OnInit, OnChanges {

  @Input()
  data: Array<Array<string | number>>;

  @Input()
  columnNames: Array<string>;

  @Input()
  roles: Array<{type: string, role: string}> = new Array();

  @Input()
  title: string;

  @Input()
  width: number = undefined;

  @Input()
  height: number = undefined;

  @Input()
  dynamicResize = false;

  @Input()
  options: any = {};

  @Input()
  type: string;

  @Input()
  formatter: any | Array<{ formatter: any, colIndex: number }>;

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
    private loaderService: ScriptLoaderService
  ) { }

  ngOnInit() {
    if (!this.type || !this.data) {
      throw new Error('Can\'t create a Google Chart without passing a type and data.');
    }

    this.loaderService.onReady.subscribe(() => {
      this.createChart();
    });
  }

  ngOnChanges() {
    if (this.wrapper) {
      this.updateChart();
    }
  }

  protected get parsedOptions() {
    return {
      title: this.title,
      width: this.width,
      height: this.height,
      ...this.options
    };
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.dynamicResize) {
      if (this.wrapper) {
        this.updateChart();
      }
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
    return this.loaderService.loadChartPackages([GoogleChartPackagesHelper.getPackageForChartName(this.type)]);
  }

  protected updateChart() {
    const dataTable = this.getDataTable();
    this.formatData(dataTable);

    this.wrapper.setChartType(this.type);
    this.wrapper.setDataTable(dataTable);
    this.wrapper.setOptions(this.parsedOptions);

    this.removeChartEvents();
    this.registerChartEvents();

    this.wrapper.draw(this.element.nativeElement);
  }

  protected getDataTable(): google.visualization.DataTable {
    if (this.columnNames) {
      return google.visualization.arrayToDataTable([
        [...this.columnNames, ...this.roles],
        ...this.data
      ], false);
    } else {
      return google.visualization.arrayToDataTable(this.data, true);
    }
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
