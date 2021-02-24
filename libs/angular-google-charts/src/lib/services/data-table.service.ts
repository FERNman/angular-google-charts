import { Injectable } from '@angular/core';

import { Column, Row } from '../components/chart-base/chart-base.component';
import { Formatter } from '../types/formatter';

@Injectable({ providedIn: 'root' })
export class DataTableService {
  public create(data: Row[] | undefined, columns?: Column[], formatters?: Formatter[]): google.visualization.DataTable | undefined {
    if (data == null) {
      return undefined;
    }

    let firstRowIsData = true;
    if (columns != null) {
      firstRowIsData = false;
    }

    const dataTable = google.visualization.arrayToDataTable(this.getDataAsTable(data, columns), firstRowIsData);
    if (formatters) {
      this.applyFormatters(dataTable, formatters);
    }

    return dataTable;
  }

  private getDataAsTable(data: Row[], columns: Column[] | undefined): (Row | Column[])[] {
    if (columns) {
      return [columns, ...data];
    } else {
      return data;
    }
  }

  private applyFormatters(dataTable: google.visualization.DataTable, formatters: Formatter[]): void {
    for (const val of formatters) {
      val.formatter.format(dataTable, val.colIndex);
    }
  }
}
