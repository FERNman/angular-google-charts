import { ModuleWithProviders, NgModule } from '@angular/core';

import { GoogleChartComponent } from './google-chart/google-chart.component';
import { CHART_VERSION, GOOGLE_API_KEY } from './models/injection-tokens.model';
import { RawChartComponent } from './raw-chart/raw-chart.component';

@NgModule({
  declarations: [GoogleChartComponent, RawChartComponent],
  exports: [GoogleChartComponent, RawChartComponent]
})
export class GoogleChartsModule {
  public static forRoot(googleApiKey?: string, chartVersion?: string): ModuleWithProviders {
    return {
      ngModule: GoogleChartsModule,
      providers: [
        { provide: GOOGLE_API_KEY, useValue: googleApiKey ? googleApiKey : '' },
        { provide: CHART_VERSION, useValue: chartVersion ? chartVersion : '46' }
      ]
    };
  }
}
