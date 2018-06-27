import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScriptLoaderService } from './services/script-loader.service';

import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { AreaChartComponent } from './components/area-chart/area-chart.component';
import { BubbleChartComponent } from './components/bubble-chart/bubble-chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { ColumnChartComponent } from './components/column-chart/column-chart.component';
import { CandlestickChartComponent } from './components/candlestick-chart/candlestick-chart.component';
import { ComboChartComponent } from './components/combo-chart/combo-chart.component';
import { HistogramComponent } from './components/histogram/histogram.component';
import { ScatterChartComponent } from './components/scatter-chart/scatter-chart.component';
import { SteppedAreaChartComponent } from './components/stepped-area-chart/stepped-area-chart.component';
import { GenericChartComponent } from './components/generic-chart/generic-chart.component';

@NgModule({
  providers: [
    ScriptLoaderService
  ],
  declarations: [
    PieChartComponent,
    BarChartComponent,
    AreaChartComponent,
    BubbleChartComponent,
    LineChartComponent,
    ColumnChartComponent,
    CandlestickChartComponent,
    ComboChartComponent,
    HistogramComponent,
    ScatterChartComponent,
    SteppedAreaChartComponent,
    GenericChartComponent
  ],
  exports: [
    PieChartComponent,
    BarChartComponent,
    AreaChartComponent,
    BubbleChartComponent,
    LineChartComponent,
    ColumnChartComponent,
    CandlestickChartComponent,
    ComboChartComponent,
    HistogramComponent,
    ScatterChartComponent,
    SteppedAreaChartComponent,
    GenericChartComponent
  ]
})
export class GoogleChartModule { }
