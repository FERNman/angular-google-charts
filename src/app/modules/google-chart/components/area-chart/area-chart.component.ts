import { Component, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ChartComponent } from '../../components/chart.component';
import { ScriptLoaderService } from '../../services/script-loader.service';

@Component({
  selector: 'area-chart',
  template: '',
  styles: [':host { width: fit-content; display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaChartComponent extends ChartComponent {

  constructor(
    element: ElementRef,
    scriptLoader: ScriptLoaderService
  ) {
    super(element, scriptLoader);
  }

  protected createChartByType(element: HTMLElement) {
    return new google.visualization.AreaChart(element);
  }
}
