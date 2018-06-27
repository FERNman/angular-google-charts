import { Component, OnInit, ElementRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { ChartComponent } from '../chart.component';
import { ScriptLoaderService } from '../../services/script-loader.service';

@Component({
  selector: 'generic-chart',
  template: '',
  styles: [':host { width: fit-content; display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericChartComponent extends ChartComponent {

  @Input()
  type: string;

  private wrapper: any;

  constructor(
    element: ElementRef,
    scriptLoader: ScriptLoaderService
  ) {
    super(element, scriptLoader);
  }

  protected createChart(element: HTMLElement) {
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

  protected createChartByType(element: HTMLElement) {
    return null;
  }
}
