import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { GoogleChartPackagesHelper } from '../helpers/google-chart-packages.helper';
import { ChartErrorEvent, ChartEvent } from '../models/events.model';
import { ScriptLoaderService } from '../script-loader/script-loader.service';

interface CustomFormatter {
  formatter: google.visualization.DefaultFormatter;
  colIndex: number;
}

type Formatter = google.visualization.DefaultFormatter | CustomFormatter[];

@Component({
  selector: 'raw-chart',
  template: '',
  styles: [':host { width: fit-content; display: block; }'],
  host: { class: 'raw-chart' },
  exportAs: 'raw-chart',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RawChartComponent implements OnInit, OnChanges, AfterViewInit {
  @Input()
  public chartData: google.visualization.ChartSpecs;

  @Input()
  public formatter: Formatter;

  @Input()
  public dynamicResize = false;

  @Input()
  public firstRowIsData = false;

  @Output()
  public error = new EventEmitter<ChartErrorEvent>();

  @Output()
  public ready = new EventEmitter();

  @Output()
  public select = new EventEmitter<ChartEvent>();

  @Output()
  public mouseenter = new EventEmitter<ChartEvent>();

  @Output()
  public mouseleave = new EventEmitter<ChartEvent>();

  public wrapper: google.visualization.ChartWrapper;

  private dataTable: google.visualization.DataTable;

  constructor(protected element: ElementRef, protected loaderService: ScriptLoaderService) {}

  public ngOnInit() {
    if (this.chartData == null) {
      throw new Error("Can't create a Google Chart without data!");
    }

    this.createChart();
  }

  public ngAfterViewInit() {
    this.addResizeListener();
  }

  public ngOnChanges() {
    if (this.wrapper) {
      this.updateChart();
    }
  }

  public getChartElement(): HTMLElement {
    return this.element.nativeElement.firstElementChild;
  }

  public clearChart(): void {
    if (this.wrapper && this.wrapper.getChart()) {
      this.wrapper.getChart().clearChart();
    }
  }

  protected createChart() {
    this.loadNeededPackages().subscribe(() => {
      this.wrapper = new google.visualization.ChartWrapper();
      this.updateChart();
    });
  }

  protected loadNeededPackages(): Observable<void> {
    return this.loaderService.loadChartPackages(GoogleChartPackagesHelper.getPackageForChartName(this.chartData.chartType));
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
      this.registerChartEvent(this.wrapper.getChart(), 'onmouseover', (event: ChartEvent) => this.mouseenter.emit(event));
      this.registerChartEvent(this.wrapper.getChart(), 'onmouseout', (event: ChartEvent) => this.mouseleave.emit(event));

      this.ready.emit('Chart Ready');
    });

    this.registerChartEvent(this.wrapper, 'error', (error: ChartErrorEvent) => this.error.emit(error));
    this.registerChartEvent(this.wrapper, 'select', () => {
      const selection = this.wrapper.getChart().getSelection();
      this.select.emit(selection);
    });
  }

  private registerChartEvent(object: any, eventName: string, callback: Function) {
    google.visualization.events.addListener(object, eventName, callback);
  }
}
