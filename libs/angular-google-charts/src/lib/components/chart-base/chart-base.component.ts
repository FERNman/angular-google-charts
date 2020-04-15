import { Directive, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { ChartErrorEvent, ChartReadyEvent, ChartSelectionChangedEvent } from '../../models/events.model';

export type Column = string | google.visualization.ColumnSpec;
export type Row = (string | number | Date)[];

@Directive()
// tslint:disable-next-line: directive-class-suffix
export class ChartBase {
  /**
   * The chart is ready for external method calls.
   *
   * Emits *after* the chart was drawn for the first time every time the chart gets redrawn.
   */
  @Output()
  public ready: EventEmitter<ChartReadyEvent>;

  /**
   * Emits when an error occurs when attempting to render the chart.
   */
  @Output()
  public error: EventEmitter<ChartErrorEvent>;

  /**
   * Emits when the user clicks a bar or legend.
   *
   * When a chart element is selected, the corresponding cell
   * in the data table is selected; when a legend is selected,
   * the corresponding column in the data table is selected.
   */
  @Output()
  public select: EventEmitter<ChartSelectionChangedEvent>;

  /**
   * The drawn chart or `null`.
   */
  public chart: google.visualization.ChartBase | null;

  /**
   * The underlying chart wrapper or `null`.
   */
  public chartWrapper: google.visualization.ChartWrapper | null;

  /**
   * Emits after the `ChartWrapper` is created, but before the chart is drawn for the first time.
   */
  public wrapperReady$: Observable<google.visualization.ChartWrapper>;
}
