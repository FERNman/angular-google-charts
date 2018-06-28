import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [':host > *:not(h1) { display: inline-block !important; }']
})
export class AppComponent {
  charts: Array<{
    title: string,
    type: string,
    data: Array<Array<string | number | {}>>,
    roles: Array<{type: string, role: string}>,
    dataTitles?: Array<string>,
    options?: {}
  }> = [];

  constructor() {
    this.charts.push({
      title: 'Pie Chart',
      type: 'PieChart',
      dataTitles: ['Task', 'Hours per Day'],
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
      dataTitles: ['Element', 'Density'],
      roles: [{ role: 'style', type: 'string' }],
      data: [
        ['Copper', 8.94, '#b87333'],            // RGB value
        ['Silver', 10.49, 'silver'],            // English color name
        ['Gold', 19.30, 'gold'],
        ['Platinum', 21.45, 'color: #e5e4e2' ], // CSS-style declaration
      ]
    });

    this.charts.push({
      title: 'Area Chart',
      type: 'AreaChart',
      dataTitles: ['Year', 'Sales', 'Expenses'],
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
      dataTitles: ['ID', 'X', 'Y'],
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
      dataTitles: null,
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
      dataTitles: ['Month', 'Bolivia', 'Ecuador', 'Madagascar', 'Papua New Guinea', 'Rwanda', 'Average'],
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
  }

  histogramDataTitles = ['Dinosaur', 'Length'];

  histogramData = [
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
  ];

  scatterDataTitles = ['Age', 'Weight'];

  scatterData = [
    [ 8,      12],
    [ 4,      5.5],
    [ 11,     14],
    [ 4,      5],
    [ 3,      3.5],
    [ 6.5,    7]
  ];
}
