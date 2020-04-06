import { ModuleWithProviders, NgModule } from '@angular/core';

import { GoogleChartComponent } from './google-chart/google-chart.component';
import { Config } from './models/config.model';
import { CHART_VERSION, MAPS_API_KEY } from './models/injection-tokens.model';
import { RawChartComponent } from './raw-chart/raw-chart.component';

@NgModule({
  declarations: [GoogleChartComponent, RawChartComponent],
  exports: [GoogleChartComponent, RawChartComponent]
})
export class GoogleChartsModule {
  public static forRoot({ mapsApiKey, version }: Config = {}): ModuleWithProviders<GoogleChartsModule> {
    return {
      ngModule: GoogleChartsModule,
      providers: [
        { provide: MAPS_API_KEY, useValue: mapsApiKey },
        { provide: CHART_VERSION, useValue: version }
      ]
    };
  }
}
