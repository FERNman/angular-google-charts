export interface ChartReadyEvent<T extends google.visualization.ChartBase = google.visualization.ChartBase> {
  /**
   * The newly instantiated chart.
   */
  chart: T;
}

export interface ChartSelectionChangedEvent {
  /**
   * An array of objects describing the selected data elements.
   *
   * These objects have the properties `row` and `column`.
   * `row` and `column` are the row and column indexes of the selected item in the charts' data.
   *
   * If both `row` and `column` are specified, the selected element is a cell.
   * If only `row` is specified, the selected element is a row.
   * If only `column` is specified, the selected element is a column.
   */
  selection: google.visualization.ChartSelection[];
}

export interface ChartMouseOverEvent {
  /**
   * The index of the column of the hovered item in the chart data.
   */
  column: number;

  /**
   * The index of the row of the hovered item in the chart data.
   */
  row: number;
}

export interface ChartMouseLeaveEvent {
  column: number;
  row: number;
}

export interface ChartErrorEvent {
  /**
   * The ID of the DOM element containing the chart, or
   * an error message displayed instead of the chart if it cannot be rendered.
   */
  id: string;

  /**
   * A short message string describing the error.
   */
  message: string;

  /**
   * A detailed explanation of the error.
   */
  detailedMessage?: string;

  /**
   * An object containing custom parameters appropriate to this error and chart type.
   */
  options?: object;
}
