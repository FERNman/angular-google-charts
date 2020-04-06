import { ModuleWithProviders, NgModule } from '@angular/core';

import { GoogleChartComponent } from './google-chart/google-chart.component';
import { GoogleChartsConfig } from './models/google-charts-config.model';
import { GOOGLE_CHARTS_CONFIG } from './models/injection-tokens.model';
import { RawChartComponent } from './raw-chart/raw-chart.component';

@NgModule({
  declarations: [GoogleChartComponent, RawChartComponent],
  exports: [GoogleChartComponent, RawChartComponent]
})
export class GoogleChartsModule {
  public static forRoot(config: GoogleChartsConfig = {}): ModuleWithProviders<GoogleChartsModule> {
    return {
      ngModule: GoogleChartsModule,
      providers: [{ provide: GOOGLE_CHARTS_CONFIG, useValue: config }]
    };
  }
}
