/// <reference types="@types/google.visualization" />

declare namespace google {
  namespace visualization {
    export interface ChartEditorOptions {
      dataSourceInput?: HTMLElement | 'urlbox';
    }

    export class ChartEditor {
      public openDialog(chartWrapper: google.visualization.ChartWrapper, options: ChartEditorOptions): void;
      public getChartWrapper(): google.visualization.ChartWrapper;
      public setChartWrapper(chartWrapper: google.visualization.ChartWrapper): void;
      public closeDialog(): void;
    }
  }
}
