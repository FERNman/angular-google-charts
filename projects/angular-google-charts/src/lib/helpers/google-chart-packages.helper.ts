export class GoogleChartPackagesHelper {
    private static ChartTypesToPackages = {
        AnnotationChart: 'annotationchart',
        AreaChart: 'corechart',
        Bar: 'bar',
        BarChart: 'corechart',
        BubbleChart: 'corechart',
        Calendar: 'calendar',
        CandlestickChart: 'corechart',
        ColumnChart: 'corechart',
        ComboChart: 'corechart',
        PieChart: 'corechart',
        Gantt: 'gantt',
        Gauge: 'gauge',
        GeoChart: 'geochart',
        Histogram: 'corechart',
        Line: 'line',
        LineChart: 'corechart',
        Map: 'map',
        OrgChart: 'orgchart',
        Sankey: 'sankey',
        Scatter: 'scatter',
        ScatterChart: 'corechart',
        SteppedAreaChart: 'corechart',
        Table: 'table',
        Timeline: 'timeline',
        TreeMap: 'treemap',
        WordTree: 'wordtree'
    };

    public static getPackageForChartName(chartName: string): string {
        return GoogleChartPackagesHelper.ChartTypesToPackages[chartName];
    }
}
