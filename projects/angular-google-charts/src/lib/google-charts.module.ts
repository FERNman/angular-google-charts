import { NgModule, Provider, LOCALE_ID, InjectionToken, ModuleWithProviders } from '@angular/core';

import { ScriptLoaderService } from './script-loader/script-loader.service';
import { GoogleChartComponent } from './google-chart/google-chart.component';
import { GOOGLE_API_KEY } from './models/injection-tokens.model';

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
  public static forRoot(googleApiKey?: string): ModuleWithProviders {
    return {
      ngModule: GoogleChartsModule,
      providers: [
        GOOGLE_CHARTS_PROVIDERS,
        { provide: GOOGLE_API_KEY, useValue: googleApiKey ? googleApiKey : '' }
      ]
    };
  }
}

export function setupScriptLoaderService(localeId: string, googleApiKey: string): ScriptLoaderService {
  return new ScriptLoaderService(localeId, googleApiKey);
}
