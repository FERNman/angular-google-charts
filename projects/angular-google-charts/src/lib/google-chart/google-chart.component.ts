/// <reference types="google.visualization"/>

import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit } from '@angular/core';

import { Role } from '../models/role.model';
import { RawChartComponent } from '../raw-chart/raw-chart.component';
import { ScriptLoaderService } from '../script-loader/script-loader.service';

@Component({
  selector: 'google-chart',
  template: '',
  styles: [':host { width: fit-content; display: block; }'],
  exportAs: 'google-chart',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleChartComponent extends RawChartComponent implements OnInit, OnChanges {
  @Input()
  public data: Array<Array<string | number>>;

  @Input()
  public columnNames: Array<string>;

  @Input()
  public roles: Array<Role> = new Array();

  @Input()
  public title: string;

  @Input()
  public width: number = undefined;

  @Input()
  public height: number = undefined;

  @Input()
  public options: any = {};

  @Input()
  public type: string;

  constructor(element: ElementRef, loaderService: ScriptLoaderService) {
    super(element, loaderService);
  }

  public ngOnInit() {
    if (this.type == null) {
      throw new Error('Can\'t create a Google Chart without specifying a type!');
    }
    if (this.data == null) {
      throw new Error('Can\'t create a Google Chart without data!');
    }

    this.chartData = {
      chartType: this.type
    };

    this.loaderService.onReady.subscribe(() => {
      this.createChart();
    });
  }

  public ngOnChanges() {
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

  protected getDataTable(): Array<any> {
    if (this.columnNames) {
      const columns = this.parseRoles(this.columnNames);
      this.firstRowIsData = false;
      return [columns, ...this.data];
    } else {
      this.firstRowIsData = true;
      return this.data;
    }
  }

  private parseRoles(columnNames: any[]): any[] {
    const columnNamesWithRoles = columnNames.slice();
    if (this.roles) {
      // Roles must be copied to avoid modifying the index everytime there's a change from ngOnChanges.
      const copyRoles = this.roles.map(role => Object.assign({}, role));
      copyRoles.forEach(role => {
        const roleData: Role = {
          type: role.type,
          role: role.role
        };
        if (role.p) {
          roleData.p = role.p;
        }
        if (role.index != null) {
          columnNamesWithRoles.splice(role.index + 1, 0, roleData);

          for (const otherRole of copyRoles) {
            if (otherRole === role) {
              continue;
            }

            if (otherRole.index > role.index) {
              otherRole.index++;
            }
          }
        } else {
          columnNamesWithRoles.push(roleData);
        }
      });
    }

    return columnNamesWithRoles;
  }
}
