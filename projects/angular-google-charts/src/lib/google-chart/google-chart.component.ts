/// <reference types="google.visualization"/>

import { Component, OnInit, ElementRef, Input, ChangeDetectionStrategy, OnChanges, Output, EventEmitter } from '@angular/core';
import { ChartErrorEvent, ChartEvent } from '../models/events.model';
import { ScriptLoaderService } from '../script-loader/script-loader.service';

@Component({
  selector: 'google-chart',
  template: '',
  styles: [':host { width: fit-content; display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleChartComponent implements OnInit, OnChanges {

  @Input()
  data: Array<Array<string | number>>;

  @Input()
  dataTitles: Array<string>;

  @Input()
  roles: Array<{type: string, role: string}> = new Array();

  @Input()
  title: string;

  @Input()
  width: number = 400;

  @Input()
  height: number = 400;

  @Input()
  options: any = {};

  @Input()
  type: string;

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
    this.loaderService.onLoad.subscribe(() => {
      this.createChart();
    });
  }

  ngOnChanges() {
    // If the wrapper is still undefined, the loader service is working
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

  protected get parsedData(): google.visualization.DataTable {
    let dataTable: google.visualization.DataTable = null;
    if (this.dataTitles) {
      dataTable = google.visualization.arrayToDataTable([
        [...this.dataTitles, ...this.roles],
        ...this.data
      ], false);
    } else {
      dataTable = google.visualization.arrayToDataTable(this.data, true);
    }
    return dataTable;
  }

  protected createChart() {
    this.wrapper = new google.visualization.ChartWrapper();
    this.updateChart();
  }

  protected registerEvents() {
    google.visualization.events.removeAllListeners(this.wrapper);

    google.visualization.events.addListener(this.wrapper, 'ready', () => this.ready.emit('Chart Ready'));
    google.visualization.events.addListener(this.wrapper, 'error', (error) => this.error.emit(error));
    google.visualization.events.addListener(this.wrapper, 'select', () => {
      const selection = this.wrapper.getChart().getSelection();
      this.select.emit(selection);
    });
    google.visualization.events.addListener(this.wrapper.getChart(), 'onmouseover', (event) => this.mouseenter.emit(event));
    google.visualization.events.addListener(this.wrapper.getChart(), 'onmouseout', (event) => this.mouseleave.emit(event));
  }

  protected updateChart() {
    this.wrapper.setChartType(this.type);
    this.wrapper.setDataTable(this.parsedData);
    this.wrapper.setOptions(this.parsedOptions);

    this.wrapper.draw(this.element.nativeElement);

    this.registerEvents();
  }
}
