import { Component, OnInit, ElementRef, Input, ChangeDetectionStrategy, OnChanges, Output } from '@angular/core';
import { ScriptLoaderService } from '../../services/script-loader.service';
import { EventEmitter } from 'events';
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
  error = new EventEmitter();

  @Output()
  ready = new EventEmitter();

  @Output()
  select = new EventEmitter();

  private wrapper: any;

  constructor(
    private element: ElementRef,
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

  protected parseOptions() {
    return {
      title: this.title,
      width: this.width,
      height: this.height,
      ...this.options
    };
  }

  private createChart() {
    this.wrapper = new google.visualization.ChartWrapper();
    this.registerEvents();
    this.updateChart();
  }

  private registerEvents() {
    google.visualization.events.addListener(this.wrapper, 'ready', () => this.ready.emit('Chart Ready'));
    google.visualization.events.addListener(this.wrapper, 'error', (error) => this.ready.emit(error));
    google.visualization.events.addListener(this.wrapper, 'select', () => {
      const selection = this.wrapper.visualization.getSelection();
      this.ready.emit(selection);
    });
  }

  private updateChart() {
    this.wrapper.setChartType(this.type);
    this.wrapper.setDataTable([
      [...this.dataTitles, ...this.roles],
      ...this.data
    ]);
    this.wrapper.setOptions(this.parseOptions());

    this.wrapper.draw(this.element.nativeElement);
  }
}
