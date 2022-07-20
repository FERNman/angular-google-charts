import { Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  ChartBase,
  ChartEditorComponent,
  ChartType,
  FilterType,
  Formatter,
  ScriptLoaderService
} from 'angular-google-charts';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styles: ['.inline > * { display: inline-block; vertical-align: top; }']
})
export class TestComponent {
  public chart = {
    title: 'Test Chart',
    type: ChartType.BarChart,
    data: [
      ['Copper', 8.94],
      ['Silver', 10.49],
      ['Gold', 19.3],
      ['Platinum', 21.45]
    ],
    columnNames: ['Element', 'Density'],
    options: {
      animation: {
        duration: 250,
        easing: 'ease-in-out',
        startup: true
      }
    }
  };

  public dashboardData = [
    ['Michael', 5],
    ['Elisa', 7],
    ['Robert', 3],
    ['John', 2],
    ['Jessica', 6],
    ['Aaron', 1],
    ['Margareth', 8]
  ];
  public filterType = FilterType.NumberRange;

  public chartWrapperSpecs: google.visualization.ChartSpecs = {
    chartType: ChartType.AreaChart,
    dataTable: [
      ['SMR CV', 'US Cents/KG'],
      [new Date(1990, 1, 1), 10],
      [new Date(1991, 1, 1), 20],
      [new Date(1992, 1, 1), 40],
      [new Date(1993, 1, 1), 80],
      [new Date(1994, 1, 1), 160],
      [new Date(1995, 1, 1), 320],
      [new Date(1996, 1, 1), 640],
      [new Date(1997, 1, 1), 1280]
    ]
  };

  public readonly formatters$: Observable<Formatter[]> = this.scriptLoaderService.loadChartPackages().pipe(
    share(),
    map(() => [
      { colIndex: 1, formatter: new google.visualization.NumberFormat({ fractionDigits: 0, prefix: '$', suffix: '‰' }) }
    ])
  );

  @ViewChild(ChartEditorComponent)
  public readonly editor!: ChartEditorComponent;

  constructor(private location: Location, private scriptLoaderService: ScriptLoaderService) { }

  public edit(chart: ChartBase) {
    this.editor
      .editChart(chart)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          console.log(result);
        } else {
          console.log('Editing was cancelled');
        }
      });
  }

  public goBack() {
    this.location.back();
  }
}
