import { OnInit, ElementRef, Input } from '@angular/core';

import { ScriptLoaderService } from '../services/script-loader.service';

export abstract class ChartComponent implements OnInit {
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

  constructor(
    private element: ElementRef,
    private loaderService: ScriptLoaderService
  ) { }

  protected parseOptions() {
    return {
      title: this.title,
      width: this.width,
      height: this.height,
      ...this.options
    };
  }

  ngOnInit() {
    this.loaderService.onLoad.subscribe(() => {
      this.createChart(this.element.nativeElement);
    });
  }

  protected createChart(element: HTMLElement) {
    const dataTable = google.visualization.arrayToDataTable([
      [...this.dataTitles, ...this.roles],
      ...this.data
    ]);

    const options = this.parseOptions();

    const chart = this.createChartByType(element);
    chart.draw(dataTable, options);
  }

  protected abstract createChartByType(element: HTMLElement): any;
}
