import { NgModule } from '@angular/core';

import { ScriptLoaderService } from './script-loader/script-loader.service';
import { GoogleChartComponent } from './google-chart/google-chart.component';

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
export class GoogleChartsModule { }
