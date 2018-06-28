import { Component, OnInit, ElementRef, Input, ChangeDetectionStrategy, OnChanges, Output, EventEmitter } from '@angular/core';

import { ScriptLoaderService } from '../../services/script-loader.service';
import { SelectedEvent } from '../../models/events.model';

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
  error = new EventEmitter<ErrorEvent>();

  @Output()
  ready = new EventEmitter();

  @Output()
  select = new EventEmitter<SelectedEvent>();

  protected wrapper: any;

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

  protected get parsedData() {
    let dataTable = [];
    if (this.dataTitles) {
      dataTable = [
        [...this.dataTitles, ...this.roles],
        ...this.data
      ];
    } else {
      dataTable = this.data;
    }
    return dataTable;
  }

  protected createChart() {
    this.wrapper = new google.visualization.ChartWrapper();
    this.registerEvents();
    this.updateChart();
  }

  protected registerEvents() {
    google.visualization.events.addListener(this.wrapper, 'ready', () => this.ready.emit('Chart Ready'));
    google.visualization.events.addListener(this.wrapper, 'error', (error) => this.ready.emit(error));
    google.visualization.events.addListener(this.wrapper, 'select', () => {
      const selection = this.wrapper.visualization.getSelection();
      this.ready.emit(selection);
    });
  }

  protected updateChart() {
    this.wrapper.setChartType(this.type);
    this.wrapper.setDataTable(this.parsedData);
    this.wrapper.setOptions(this.parsedOptions);

    this.wrapper.draw(this.element.nativeElement);
  }
}
