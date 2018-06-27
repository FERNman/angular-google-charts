import { Component, OnInit, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, OnChanges {

  @Input()
  data: {[title: string]: number};

  @Input()
  color: string = "#27ae60";

  @Input()
  width: number = 300;

  @Input()
  height: number = 200;

  @Input()
  offset: number = 24;

  @Input()
  displayHelperLines: boolean = true;

  @Input()
  yStepCount: number = 5;

  xEntries: Array<string>;
  yEntries: Array<number>;

  xDistance: number;
  yDistance: number;

  maxYEntry: number;

  constructor() { }

  ngOnInit() {
    if (this.data) {
      this.createChart();
    }
  }

  ngOnChanges() {
    if (this.data) {
      this.createChart();
    }
  }

  private createChart() {
    this.xEntries = new Array();
    this.yEntries = new Array();

    this.maxYEntry = -1;

    for (let key in this.data) {
      if (this.data.hasOwnProperty(key)) {
        if (this.data[key] > this.maxYEntry) {
          this.maxYEntry = this.data[key];
        }

        this.xEntries.push(key);
      }
    }

    const stepSize = Math.floor(this.maxYEntry / this.yStepCount);
    for (let i = 0; i <= this.maxYEntry; i += stepSize) {
      this.yEntries.push(i);
    }

    this.xDistance = (this.width - this.offset * 2) / (this.xEntries.length);
    this.yDistance = (this.height - this.offset * 2) / (this.yEntries.length - 1);
  }
}
