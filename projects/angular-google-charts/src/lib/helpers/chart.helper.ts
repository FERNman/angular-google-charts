import { ChartType } from '../types/chart-type';
import { GoogleChartsConfig } from '../types/google-charts-config';

const ChartTypesToPackages = {
  [ChartType.AnnotationChart]: 'annotationchart',
  [ChartType.AreaChart]: 'corechart',
  [ChartType.Bar]: 'bar',
  [ChartType.BarChart]: 'corechart',
  [ChartType.BubbleChart]: 'corechart',
  [ChartType.Calendar]: 'calendar',
  [ChartType.CandlestickChart]: 'corechart',
  [ChartType.ColumnChart]: 'corechart',
  [ChartType.ComboChart]: 'corechart',
  [ChartType.PieChart]: 'corechart',
  [ChartType.Gantt]: 'gantt',
  [ChartType.Gauge]: 'gauge',
  [ChartType.GeoChart]: 'geochart',
  [ChartType.Histogram]: 'corechart',
  [ChartType.Line]: 'line',
  [ChartType.LineChart]: 'corechart',
  [ChartType.Map]: 'map',
  [ChartType.OrgChart]: 'orgchart',
  [ChartType.Sankey]: 'sankey',
  [ChartType.Scatter]: 'scatter',
  [ChartType.ScatterChart]: 'corechart',
  [ChartType.SteppedAreaChart]: 'corechart',
  [ChartType.Table]: 'table',
  [ChartType.Timeline]: 'timeline',
  [ChartType.TreeMap]: 'treemap',
  [ChartType.WordTree]: 'wordtree'
};

export function getPackageForChart(type: ChartType): string {
  return ChartTypesToPackages[type];
}

export function getDefaultConfig(): GoogleChartsConfig {
  return {
    version: 'current',
    safeMode: false
  };
}
