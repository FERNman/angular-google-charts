import { Component, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ChartComponent } from '../../components/chart.component';
import { ScriptLoaderService } from '../../services/script-loader.service';

@Component({
  selector: 'candlestick-chart',
  template: '',
  styles: [':host { width: fit-content; display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandlestickChartComponent extends ChartComponent {

  constructor(
    element: ElementRef,
    scriptLoader: ScriptLoaderService
  ) {
    super(element, scriptLoader);
    this.dataTitles = [];
  }

  protected createChartByType(element: HTMLElement) {
    return new google.visualization.CandlestickChart(element);
  }

  protected createChart(element: HTMLElement) {
      const dataTable = google.visualization.arrayToDataTable(this.data, true);

      const options = this.parseOptions();

      const chart = this.createChartByType(element);
      chart.draw(dataTable, options);
  }
}
