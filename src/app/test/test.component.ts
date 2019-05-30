import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GoogleChartPackagesHelper } from 'projects/angular-google-charts/src/public_api';
import { ScriptLoaderService } from 'projects/angular-google-charts/src/public_api';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  chart = {
    title: 'Test Chart',
    type: 'BarChart',
    data: [['Copper', 8.94], ['Silver', 10.49], ['Gold', 19.3], ['Platinum', 21.45]],
    columnNames: ['Element', 'Density'],
    options: {
      animation: {
        duration: 250,
        easing: 'ease-in-out',
        startup: true
      }
    }
  };

  rawChartData: google.visualization.ChartSpecs = {
    chartType: 'AreaChart',
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

  rawFormatter: any;
  private areaChartPackage = GoogleChartPackagesHelper.getPackageForChartName('AreaChart');

  constructor(private location: Location, private loaderService: ScriptLoaderService) {}

  ngOnInit() {
    this.loaderService.onReady.subscribe(() => {
      this.loaderService.loadChartPackages([this.areaChartPackage]).subscribe(() => {
        this.rawFormatter = [{ formatter: new google.visualization.DateFormat({ formatType: 'long' }), colIndex: 0 }];
      });
    });
  }

  goBack() {
    this.location.back();
  }
}
