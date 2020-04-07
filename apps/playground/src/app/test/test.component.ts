import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html'
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

  constructor(private location: Location) {}

  public goBack() {
    this.location.back();
  }
}
