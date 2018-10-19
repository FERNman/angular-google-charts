import { NgModule, Provider, LOCALE_ID, InjectionToken, ModuleWithProviders } from '@angular/core';

import { ScriptLoaderService } from './script-loader/script-loader.service';
import { GoogleChartComponent } from './google-chart/google-chart.component';

export const GOOGLE_API_KEY = new InjectionToken<string>('GOOGLE_API_KEY');

export const GOOGLE_CHARTS_PROVIDERS: Provider[] = [
  {
    provide: ScriptLoaderService,
    useFactory: setupScriptLoaderService,
    deps: [
      LOCALE_ID, GOOGLE_API_KEY
    ]
  }
];

@NgModule({
  providers: [
    ScriptLoaderService
  ],
  declarations: [
    GoogleChartComponent
  ],
  exports: [
    GoogleChartComponent
  ]
})
export class GoogleChartsModule {
  public static forRoot(googleApiKey?: string): ModuleWithProviders<GoogleChartsModule> {
    return {
      ngModule: GoogleChartsModule,
      providers: [
        GOOGLE_CHARTS_PROVIDERS,
        { provide: GOOGLE_API_KEY, useValue: googleApiKey ? googleApiKey : '' }
      ]
    };
  }
}

function setupScriptLoaderService(localeId: string, googleApiKey: string): ScriptLoaderService {
  return new ScriptLoaderService(localeId, googleApiKey);
}
