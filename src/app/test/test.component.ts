import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  chart = {
    title: 'Test Chart',
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

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }
}
