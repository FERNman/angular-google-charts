import { NgModule } from '@angular/core';

import { ScriptLoaderService } from './services/script-loader.service';

import { GoogleChartComponent } from './components/google-chart/google-chart.component';

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
export class GoogleChartModule { }
