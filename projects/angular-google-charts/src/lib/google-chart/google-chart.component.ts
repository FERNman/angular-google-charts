/// <reference types="google.visualization"/>

import {
  Component, OnInit, ElementRef, Input, ChangeDetectionStrategy,
  OnChanges
} from '@angular/core';

import { ScriptLoaderService } from '../script-loader/script-loader.service';
import { RawChartComponent } from '../raw-chart/raw-chart.component';
import {Role} from '../models/role.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'google-chart',
  template: '',
  styles: [':host { width: fit-content; display: block; }'],
  exportAs: 'google-chart',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleChartComponent extends RawChartComponent implements OnInit, OnChanges {

  @Input()
  data: Array<Array<string | number>>;

  @Input()
  columnNames: Array<string>;

  @Input()
  roles: Array<Role> = new Array();

  @Input()
  title: string;

  @Input()
  width: number = undefined;

  @Input()
  height: number = undefined;

  @Input()
  options: any = {};

  @Input()
  type: string;

  constructor(
    element: ElementRef,
    loaderService: ScriptLoaderService
  ) {
    super(element, loaderService);
  }

  ngOnInit() {
    if (this.type == null) { throw new Error('Can\'t create a Google Chart without specifying a type!'); }
    if (this.data == null) { throw new Error('Can\'t create a Google Chart without data!'); }

    this.chartData = {
      chartType: this.type
    };

    this.loaderService.onReady.subscribe(() => {
      this.createChart();
    });
  }

  ngOnChanges() {
    if (this.wrapper) {
      this.chartData = {
        chartType: this.type,
        dataTable: this.getDataTable(),
        options: this.parseOptions()
      };
    }

    super.ngOnChanges();
  }

  protected parseOptions(): any {
    return {
      title: this.title,
      width: this.width,
      height: this.height,
      ...this.options
    };
  }

  protected createChart() {
    this.loadNeededPackages().subscribe(() => {
      this.chartData = {
        chartType: this.type,
        dataTable: this.getDataTable(),
        options: this.parseOptions()
      };

      this.wrapper = new google.visualization.ChartWrapper();
      this.updateChart();
    });
  }

  protected getDataTable(): google.visualization.DataTable {
    if (this.columnNames) {
      const columns = this.parseRoles(this.columnNames);

      return google.visualization.arrayToDataTable([
        columns,
        ...this.data
      ], false);
    } else {
      return google.visualization.arrayToDataTable(this.data, true);
    }
  }

  private parseRoles(columnNames: any[]): any[] {
    if (this.roles) {
      this.roles.forEach(role => {
        const roleData: Role = {
          type: role.type,
          role: role.role
        };
        if (role.p) {
          roleData.p = role.p;
        }
        if (role.index != null) {
          columnNames.splice(role.index + 1, 0, roleData);

          for (const otherRole of this.roles) {
            if (otherRole === role) {
              continue;
            }

            if (otherRole.index > role.index) {
              otherRole.index++;
            }
          }
        } else {
          columnNames.push(roleData);
        }
      });
    }

    return columnNames;
  }
}
