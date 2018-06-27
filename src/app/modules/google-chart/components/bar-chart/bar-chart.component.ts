import { Component, ElementRef, ChangeDetectionStrategy, Input } from '@angular/core';

import { ChartComponent } from '../../components/chart.component';
import { ScriptLoaderService } from '../../services/script-loader.service';

@Component({
  selector: 'bar-chart',
  template: '',
  styles: [':host { width: fit-content; display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarChartComponent extends ChartComponent {

  constructor(
    element: ElementRef,
    loaderService: ScriptLoaderService
  ) {
    super(element, loaderService);
  }

  protected createChartByType(element: HTMLElement) {
    return new google.visualization.BarChart(element);
  }
}
