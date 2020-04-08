import { ModuleWithProviders, NgModule } from '@angular/core';

import { ChartWrapperComponent } from './components/chart-wrapper/chart-wrapper.component';
import { GoogleChartComponent } from './components/google-chart/google-chart.component';
import { GoogleChartsConfig } from './models/google-charts-config.model';
import { GOOGLE_CHARTS_CONFIG } from './models/injection-tokens.model';

@NgModule({
  declarations: [GoogleChartComponent, ChartWrapperComponent],
  exports: [GoogleChartComponent, ChartWrapperComponent]
})
export class GoogleChartsModule {
  public static forRoot(config: GoogleChartsConfig = {}): ModuleWithProviders<GoogleChartsModule> {
    return {
      ngModule: GoogleChartsModule,
      providers: [{ provide: GOOGLE_CHARTS_CONFIG, useValue: config }]
    };
  }
}
