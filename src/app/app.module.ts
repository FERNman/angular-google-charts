import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GoogleChartModule } from './modules/google-chart/google-chart.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    GoogleChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
