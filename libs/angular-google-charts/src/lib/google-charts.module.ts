import { LOCALE_ID, ModuleWithProviders, NgModule, Provider } from '@angular/core';

import { GoogleChartComponent } from './google-chart/google-chart.component';
import { CHART_VERSION, GOOGLE_API_KEY } from './models/injection-tokens.model';
import { RawChartComponent } from './raw-chart/raw-chart.component';
import { ScriptLoaderService } from './script-loader/script-loader.service';

export const GOOGLE_CHARTS_PROVIDERS: Provider[] = [
  {
    provide: ScriptLoaderService,
    useFactory: setupScriptLoaderService,
    deps: [LOCALE_ID, GOOGLE_API_KEY, CHART_VERSION]
  }
];

@NgModule({
  providers: [ScriptLoaderService],
  declarations: [GoogleChartComponent, RawChartComponent],
  exports: [GoogleChartComponent, RawChartComponent]
})
export class GoogleChartsModule {
  public static forRoot(googleApiKey?: string, chartVersion?: string): ModuleWithProviders {
    return {
      ngModule: GoogleChartsModule,
      providers: [
        GOOGLE_CHARTS_PROVIDERS,
        { provide: GOOGLE_API_KEY, useValue: googleApiKey ? googleApiKey : '' },
        { provide: CHART_VERSION, useValue: chartVersion ? chartVersion : '46' }
      ]
    };
  }
}

export function setupScriptLoaderService(localeId: string, googleApiKey: string, chartVersion: string): ScriptLoaderService {
  return new ScriptLoaderService(localeId, googleApiKey, chartVersion);
}
