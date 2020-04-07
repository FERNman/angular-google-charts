import { EventEmitter } from '@angular/core';

import { ChartErrorEvent, ChartReadyEvent, ChartSelectionChangedEvent } from './events.model';

export interface ChartBase {
  /**
   * The chart is ready for external method calls.
   *
   * Emits *after* the chart was drawn for the first time every time the chart gets redrawn.
   */
  ready: EventEmitter<ChartReadyEvent>;

  /**
   * Fired when an error occurs when attempting to render the chart.
   */
  error: EventEmitter<ChartErrorEvent>;

  /**
   * Fired when the user clicks a bar or legend.
   *
   * When a chart element is selected, the corresponding cell
   * in the data table is selected; when a legend is selected,
   * the corresponding column in the data table is selected.
   */
  select: EventEmitter<ChartSelectionChangedEvent>;

  /**
   * The drawn chart or `null`.
   */
  chart: google.visualization.ChartBase | null;
}
