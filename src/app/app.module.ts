import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GoogleChartsModule } from 'projects/angular-google-charts/src/public_api';
import { AppRoutingModule } from './app-routing.module';
import { TestComponent } from './test/test.component';
import { MainComponent } from './main/main.component';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleChartsModule.forRoot('AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY')
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
