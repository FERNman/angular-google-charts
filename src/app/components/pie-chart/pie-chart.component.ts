import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieChartComponent implements OnInit, OnChanges {

  paths: Array<Path>;

  @Input()
  data: {[title: string]: number};

  @Input()
  colors: Array<string> = [
    '#FFC20A',
    '#FF9A00',
    '#FD6F00',
    '#D22D27',
    '#741274',
    '#321857',
    '#150B36'
  ];

  @Input()
  width: number = 250;

  constructor() { }

  ngOnInit() {
    if (this.data) {
      this.constructArc();
    }
  }

  ngOnChanges() {
    if (this.data) {
      this.constructArc();
    }
  }

  private constructArc() {
    this.paths = new Array();

    const total = Object.values(this.data).reduce((a, b) => a + b, 0);

    let lastPercent = 0;
    for(let key in this.data) {
      if (this.data.hasOwnProperty(key)) {
        const percent = this.data[key] / total;
        const path = new Path(key, lastPercent, percent);

        this.paths.push(path);

        lastPercent += percent;
      }
    }
  }
}

class Path {
  start: Point;
  end: Point;
  tooltipPosition: string;

  constructor(public title: string, private lastPercent: number, public percent: number) {
    this.start = Path.getCoordinatesForPercent(lastPercent);
    this.end = Path.getCoordinatesForPercent(lastPercent + percent);
    this.tooltipPosition = this.lastPercent + this.percent * 0.5 > 0.5 ? 'left' : 'right';
  }

  getPathString(): string {
    return `
      M ${this.start.x} ${this.start.y}
      A 1 1 0 ${this.largeArc ? 1 : 0} 1 ${this.end.x} ${this.end.y}
      L 0 0`;
  }

  get largeArc(): boolean {
    return this.percent > 0.5;
  }

  static getCoordinatesForPercent(percent): Point {
    return new Point(
      Math.cos(2 * Math.PI * percent),
      Math.sin(2 * Math.PI * percent)
    );
  }
}

class Point {
  constructor(public x?: number, public y?: number) { }
}
