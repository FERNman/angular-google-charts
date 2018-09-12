import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartErrorEvent, ChartEvent, GoogleChartComponent } from 'projects/angular-google-charts/src/public_api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styles: [':host > *:not(h1) { display: inline-block !important; }']
})
export class MainComponent implements OnInit {

  charts: Array<{
    title: string,
    type: string,
    data: Array<Array<string | number | {}>>,
    roles: Array<{type: string, role: string}>,
    columnNames?: Array<string>,
    options?: {}
  }> = [];

  changingChart = {
    title: 'Changing Chart',
    type: 'BarChart',
    data: [
      ['Copper', 8.94],
      ['Silver', 10.49],
      ['Gold', 19.30],
      ['Platinum', 21.45],
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

  @ViewChild('chart')
  chart: GoogleChartComponent;

  constructor(
    private router: Router
  ) {
    this.charts.push({
      title: 'Pie Chart',
      type: 'PieChart',
      columnNames: ['Task', 'Hours per Day'],
      data: [
        ['Work',     11],
        ['Eat',      2],
        ['Commute',  2],
        ['Watch TV', 2],
        ['Sleep',    7]
      ],
      roles: []
    });

    this.charts.push({
      title: 'Bar Chart',
      type: 'BarChart',
      columnNames: ['Element', 'Density'],
      roles: [{ role: 'style', type: 'string' }],
      data: [
        ['Copper', 8.94, '#b87333'],
        ['Silver', 10.49, 'silver'],
        ['Gold', 19.30, 'gold'],
        ['Platinum', 21.45, 'color: #e5e4e2' ],
      ]
    });

    this.charts.push({
      title: 'Styled Line Chart',
      type: 'LineChart',
      columnNames: ['Element', 'Density'],
      roles: [
        {type: 'number', role: 'interval'},
        {type: 'number', role: 'interval'},
        {type: 'string', role: 'annotation'},
        {type: 'string', role: 'annotationText'},
        {type: 'boolean', role: 'certainty'}
      ],
      data: [
        ['April', 1000, 900, 1100, 'A', 'Stolen data', true],
        ['May', 1170, 1000, 1200, 'B', 'Coffee spill', true],
        ['June', 660, 550, 800, 'C', 'Wumpus attack', true],
        ['July', 1030, null, null, null, null, false]
      ]
    });

    this.charts.push({
      title: 'Material Bar Chart',
      type: 'Bar',
      columnNames: ['Year', 'Sales', 'Expenses', 'Profit'],
      roles: [],
      data: [
        ['2014', 1000, 400, 200],
        ['2015', 1170, 460, 250],
        ['2016', 660, 1120, 300],
        ['2017', 1030, 540, 350]
      ],
      options: {
        chart: {
          title: 'Material Bar Chart',
          subtitle: 'Sales, Expenses, and Profit: 2014-2017'
        },
        bars: 'horizontal' // Required for Material Bar Charts.
      }
    });

    this.charts.push({
      title: 'Area Chart',
      type: 'AreaChart',
      columnNames: ['Year', 'Sales', 'Expenses'],
      data: [
        ['2013', 1000, 400],
        ['2014', 1170, 460],
        ['2015', 660, 1120],
        ['2016', 1030, 540]
      ],
      roles: []
    });

    this.charts.push({
      title: 'Bubble Chart',
      type: 'BubbleChart',
      columnNames: ['ID', 'X', 'Y'],
      data: [
        ['Hallo',   80,  167],
        ['',   79,  136],
        ['',   78,  184],
        ['',   72,  278],
        ['',   81,  200],
        ['',   72,  170],
        ['',   68,  477]
      ],
      roles: []
    });

    this.charts.push({
      title: 'Candlestick Chart',
      type: 'CandlestickChart',
      columnNames: null,
      data: [
        ['Mon', 20, 28, 38, 45],
        ['Tue', 31, 38, 55, 66],
        ['Wed', 50, 55, 77, 80],
        ['Thu', 77, 77, 66, 50],
        ['Fri', 68, 66, 22, 15]
      ],
      roles: null
    });

    this.charts.push({
      title: 'Combo Chart',
      type: 'ComboChart',
      columnNames: ['Month', 'Bolivia', 'Ecuador', 'Madagascar', 'Papua New Guinea', 'Rwanda', 'Average'],
      data: [
        ['2004/05', 165, 938, 522, 998, 450, 614.6],
        ['2005/06', 135, 1120, 599, 1268, 288, 682],
        ['2006/07', 157, 1167, 587, 807, 397, 623],
        ['2007/08', 139, 1110, 615, 968, 215, 609.4],
        ['2008/09', 136, 691, 629, 1026, 366, 569.6]
      ],
      roles: [],
      options: {
        vAxis: {title: 'Cups'},
        hAxis: {title: 'Month'},
        seriesType: 'bars',
        series: {5: {type: 'line'}}
      }
    });

    this.charts.push({
      title: 'Histogram',
      type: 'Histogram',
      columnNames: ['Dinosaur', 'Length'],
      data: [
        ['Acrocanthosaurus (top-spined lizard)', 12.2],
        ['Albertosaurus (Alberta lizard)', 9.1],
        ['Allosaurus (other lizard)', 12.2],
        ['Apatosaurus (deceptive lizard)', 22.9],
        ['Archaeopteryx (ancient wing)', 0.9],
        ['Argentinosaurus (Argentina lizard)', 36.6],
        ['Baryonyx (heavy claws)', 9.1],
        ['Brachiosaurus (arm lizard)', 30.5],
        ['Ceratosaurus (horned lizard)', 6.1],
        ['Coelophysis (hollow form)', 2.7],
        ['Compsognathus (elegant jaw)', 0.9],
        ['Deinonychus (terrible claw)', 2.7],
        ['Diplodocus (double beam)', 27.1],
        ['Dromicelomimus (emu mimic)', 3.4],
        ['Gallimimus (fowl mimic)', 5.5],
        ['Mamenchisaurus (Mamenchi lizard)', 21.0],
        ['Megalosaurus (big lizard)', 7.9],
        ['Microvenator (small hunter)', 1.2],
        ['Ornithomimus (bird mimic)', 4.6],
        ['Oviraptor (egg robber)', 1.5],
        ['Plateosaurus (flat lizard)', 7.9],
        ['Sauronithoides (narrow-clawed lizard)', 2.0],
        ['Seismosaurus (tremor lizard)', 45.7],
        ['Spinosaurus (spiny lizard)', 12.2],
        ['Supersaurus (super lizard)', 30.5],
        ['Tyrannosaurus (tyrant lizard)', 15.2],
        ['Ultrasaurus (ultra lizard)', 30.5],
        ['Velociraptor (swift robber)', 1.8]
      ],
      roles: []
    });

    this.charts.push({
      title: 'Scatter Chart',
      type: 'ScatterChart',
      columnNames: ['Age', 'Weight'],
      data: [
        [8, 12],
        [4, 5.5],
        [11, 14],
        [4, 5],
        [3, 3.5],
        [6.5, 7]
      ],
      roles: []
    });
  }

  onReady() {
    console.log('Chart ready');
  }

  onError(error: ChartErrorEvent) {
    console.log('Error: ' + error.toString());
  }

  onSelect(event: ChartEvent) {
    console.log('Selected: ' + event.toString());
  }

  onMouseEnter(event: ChartEvent) {
    console.log('Hovering ' + event.toString());
  }

  onMouseLeave(event: ChartEvent) {
    console.log('No longer hovering ' + event.toString());
  }

  ngOnInit() {
    console.log(this.chart);
  }

  changeChart() {
    this.changingChart.data = [
      ['Copper', Math.random() * 20.0],
      ['Silver', Math.random() * 20.0],
      ['Gold', Math.random() * 20.0],
      ['Platinum', Math.random() * 20.0],
    ];
  }

  navigateToTest() {
    this.router.navigateByUrl('/test');
  }
}
