import { Component, OnInit, ElementRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { ScriptLoaderService } from '../../services/script-loader.service';

@Component({
  selector: 'google-chart',
  template: '',
  styles: [':host { width: fit-content; display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleChartComponent implements OnInit {

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

  private wrapper: any;

  constructor(
    private element: ElementRef,
    private loaderService: ScriptLoaderService
  ) { }

  ngOnInit() {
    this.loaderService.onLoad.subscribe(() => {
      this.createChart(this.element.nativeElement);
    });
  }

  protected parseOptions() {
    return {
      title: this.title,
      width: this.width,
      height: this.height,
      ...this.options
    };
  }

  private createChart(element: HTMLElement) {
    this.wrapper = new google.visualization.ChartWrapper({
      chartType: this.type,
      dataTable: [
        [...this.dataTitles, ...this.roles],
        ...this.data
      ],
      options: this.parseOptions()
    });

    this.wrapper.draw(element);
  }
}
