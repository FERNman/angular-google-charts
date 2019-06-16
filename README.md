# Angular-Google-Charts

This library provides a wrapper of the [Google Charts](https://google-developers.appspot.com/chart/) library for Angular 6 & 7. It is built with the AngularCLI and includes some examples.

## Setup

To use Angular-Google-Charts in your project, install the package with npm by calling

```
npm install angular-google-charts
```

This will add the package to your package.json and install the required dependencies.

## Usage

Import the `GoogleChartsModule` in your `app.module.ts`:

```typescript
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
  ...
  imports: [
    ...
    GoogleChartsModule.forRoot(),
    ...
  ],
  ...
})
export class AppModule {}
```

If you want to use GeoCharts, you may want to provide a Maps API Key. More information on this can be found in the [official documentation](https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings).

To do so, just add your Maps API Key in the `GoogleChartsModule.forRoot()` method like this:

```typescript
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
  ...
  imports: [
    ...
    GoogleChartsModule.forRoot('my-custom-maps-api-key'),
    ...
  ],
  ...
})
export class AppModule {}
```

If you want to use a specific version of Google Charts, you will need to provide a Maps API Key or an empty string for the first parameter and then the charts version as a string. This must be something like this: '45.2', '45', 'current', 'upcoming', etc... More information on this can be found in the [official documentation](https://developers.google.com/chart/interactive/docs/basic_load_libs).

To do so, just add your chart version in the `GoogleChartsModule.forRoot()` method like this:

```typescript
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
  ...
  imports: [
    ...
    GoogleChartsModule.forRoot('my-custom-maps-api-key or not', 'chart-version'),
    ...
  ],
  ...
})
export class AppModule {}
```

*Note:*

It is not necessary to import the `GoogleChartsModule` by calling its `forRoot` method. You can simply import the module as well.

## Charts

To create a chart, you have two possible components to use, the `RawChartComponent` and the `GoogleChartComponent`.

### Raw Chart Component

```html
<raw-chart></raw-chart>
```

This component is really not more than a wrapper around the basic Google-Charts `ChartWrapper`. It provides a bit of extra functionality, such as automatically
resizing when the width of the parent changes.

#### Chart Data
`google.visualization.ChartSpecs`

```html
<raw-chart [chartData]="myChartData"></raw-chart>
```

The chart data is an object that allows you to pass all chart configuration options at once. Please refer to the [Google documentation](https://developers.google.com/chart/interactive/docs/drawing_charts#chartwrapper) for more information. Everything you can pass to the ChartWrapper can be
passed here as well.

#### First Row is Data
`boolean`

```html
<raw-chart [firstRowIsData]="true"></raw-chart>
```

This property is necessary when you want to create a raw chart that has the first row as data row. Defaults to false as for most charts the first row is the header row.

#### Formatter
`Array<{formatter: google.visualization.DefaultFormatter, colIndex: number}> | google.visualization.DefaultFormatter`

```html
<raw-chart [formatter]="myFormatter"></raw-chart>
```

The `formatter` property is optional and allows to format the chart data. You can pass in either a formatter class instance or an array of objects containing a formatter and an index.
If passing a formatter class instance, every column will be formatted according to it. When passing in an array, you can specify which columns to format.

```typescript
// Formats the column with the index 1 and 3 to Date(long)
myFormatter = [
  { formatter: new google.visualization.Dateformat({formatType: 'long'}), colIndex: 1 },
  { formatter: new google.visualization.Dateformat({formatType: 'long'}), colIndex: 3 }
];
```

For more information and all formatter types, please refer to the [documentation](https://google-developers.appspot.com/chart/interactive/docs/reference#formatters).

*Note: When you get the error "google is not defined" whilst using the formatter in your component, you probably didn't load the script. Please see [CustomComponents](#custom-components)*.

#### Dynamic Resize
`boolean`

```html
<raw-chart [dynamicResize]="dynamicResize"></raw-chart>
```

The `dynamicResize` property is optional and makes your chart listen on `window.resize` events to adapt it's size.
Defaults to `false` and should only be used when setting the width or height of the chart to a percentage value. Otherwise, the chart gets redrawn unnecessary and therefore slows down the site.

#### Styling

```html
<raw-chart style="width: 100%;"></raw-chart>
```

Many CSS properties work - exactly as you would expect them to - for the `raw-chart`. If you want to have the chart full-width, just set the width to 100% and it will work.

### Google Chart Component

```html
<google-chart></google-chart>
```

The component provides a few input properties for convenience. It extends the RawChartComponent under the hood, so everything
that's possible in the `RawChartComponent` also works in the `GoogleChartComponent`.

#### Type (required)
`string`

```html
<google-chart [type]="myType"></google-chart>
```

The type specifies which type of chart you want to display. It requires a string. Examples include:
- `'BarChart'`
- `'PieChart'`
- `'ColumnChart'`
- `'AreaChart'`
- `'Bubblechart'`
- etc.

For a full list of the types available, please refer to [ChartTypes.md](./ChartTypes.md).

For more chart types and information, please see the [google chart gallery](https://google-developers.appspot.com/chart/interactive/docs/gallery).

#### Data (required)
`Array<Array<any>>`

```html
<google-chart [data]="myData"></google-chart>
```

The data property expects an object of type `Array<Array<any>>`. The first object in the inner array should be the name of the data entry, and the following objects should be the data you want to display. The inner Array must contain the name of the entry and the data value(s). Every inner array must be of the same length.

```typescript
myData = [
  ['London', 8136000],
  ['New York', 8538000],
  ['Paris', 2244000],
  ['Berlin', 3470000],
  ['Kairo', 19500000],
  ...
];
```

The data object can also include formatters for the given data. To use these, pass an object of type `{v: any, f: string}` as the data values in the inner array. The property `v` should contain the real value, and the property `f` the formatted value.

```typescript
myData = [
  ['London', {v: 8136000, f: '8,1360'}],
  ['New York', {v: 8538000, f: '8,530'}],
  ...
];
```

For further information, please see the official [google documentation](https://google-developers.appspot.com/chart/interactive/docs/reference#arraytodatatable) on `arraytodatatable`, which is the function used internally, or read the examples included.

### ColumnNames (required for most charts)
`Array<string>`

```html
<google-chart [columnNames]="myColumnNames"></google-chart>
```

The `columnNames` property expects an `Array<string>` containing the names for each column of the chart data. The number of entries must match the length of the inner array passed in the `data` property.
Some charts don't require columnNames. Whether your chart requires it can be check in the official documentation.

```typescript
myColumnNames = ['City', 'Inhabitants'];
```

### Roles
`Array<{ role: string, type: string, index?: number, p?: object }>`

```html
<google-chart [roles]="myRoles"></google-chart>
```

The `roles` property is optional and can be used for additional, row specific styling options. If provided, the length of the array must match the length of the roles provided in each of the inner arrays of the data object.
The optional `index` attribute can be used to place roles relative to columns. When specified, the role will be inserted **after** 
after the `ColumnName` at the given index. If it is not specified (*default*), all roles will be appended at the back of the `ColumnNames`. 
The optional `p` attribute is used e.g. when you want to use html in a tooltip.
In that case you have to set `p` with `{html: true}`.


```typescript
myRoles = [
  { role: 'style', type: 'string', index: 2 }
];

myData = [
  ['Element', 10.5, '#ffaaff'] // The last entry in the array is the role
];
```

For further information, please see the [google documentation](https://google-developers.appspot.com/chart/interactive/docs/roles).

For further information on the `p` attribute, please see the [google documentation](https://developers.google.com/chart/interactive/docs/reference#methods).
### Title
`string`

```html
<google-chart [title]="myTitle"></google-chart>
```

The `title` property is optional and provided for convenice. It can also be included in the `options` property.

### Width
`number`

```html
<google-chart [width]="myWidth"></google-chart>
```

The `width` property is optional and allows to set the width of the chart. The number provided will be converted to a pixel value. The default is `undefined`, which makes the chart figure out its width by itself.
You can also set the width using css, which has the advantage of allowing `%` values instead of only pixels. For more information on that, see [dynamic resize](#dynamic-resize).

### Height
`number`

```html
<google-chart [height]="myHeight"></google-chart>
```

The `height` property is optional and allows to set the height of the chart. The number provided will be converted to a pixel value. The default is `undefined`, which makes the chart figure out its height by itself.
You can also set the height using css, which has the advantage of allowing `%` values instead of only pixels. For more information on that, see [dynamic resize](#dynamic-resize).

### Options
`object`

```html
<google-chart [options]="myOptions"></google-chart>
```

The `options` property is optional and allows to customize the chart to a great extent. For more information, please see the [google documentation](https://google-developers.appspot.com/chart/interactive/docs/customizing_charts).

```typescript
myOptions = {
  colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
  is3D: true
};
```

## Animations

To animate your charts, simply add the property `animation` to your chart's `options` object.

```typescript
const myOptions = {
  ...
  animation: {
    duration: 1000,
    easing: 'out',
  },
  ...
};
```

For more information, please read the [official documentation](https://google-developers.appspot.com/chart/interactive/docs/animation).

## Events

The `GoogleChartComponent` provides bindings for the most common Google Chart events. It also includes two interfaces for those two events:

```typescript
interface ChartEvent {
  column: number;
  row: number;
}
```

```typescript
interface ChartErrorEvent {
  id: string;
  message: string;
  detailedMessage: string;
  options: object;
}
```

### Ready Event

The `ready` event fires as soon as a chart is fully loaded and rendered. It can be bound to like this:

```html
<google-chart (ready)="onReady()"></google-chart>
```

The event doesn't have any parameters.

### Error Event

The `error` event fires when an internal error occurs. However, since the newer versions of google-charts, most errors are displayed in the chart HTML as well. It can be bound to like this:

```html
<google-chart (error)="onError($event)"></google-chart>
```

The event is of type `ChartErrorEvent`.

### Select Event

The `select` event fires when an element in the chart (i. e. a bar in a bar chart or a segment in a pie chart) gets selected. It can be bound to like this:

```html
<google-chart (select)="onSelect($event)"></google-chart>
```

The event is either of type `ChartEvent`, where column is the selected column in the data and row is the selected row, or it's `undefined`. If it's `undefined`, the selection got cancelled.

### Mouseenter Event

The `mouseenter` event fires when the mouse enters the bounding box of one of the charts elements (i. e. a bar in a bar chart or a segment in a pie chart). It can be bound to like this:

```html
<google-chart (mouseenter)="onMouseEnter($event)"></google-chart>
```

The event is of type `ChartEvent`, where column is the index of the hovered column and row is the index of the hovered row.

### Mouseleave Event

The `mouseleave` event fires when the mouse leaves the bounding box of one of the charts elements (i. e. a bar in a bar chart or a segment in a pie chart). It can be bound to like this:

```html
<google-chart (mouseleave)="onMouseLeave($event)"></google-chart>
```

The event is of type `ChartEvent`, where column is the index of the hovered column and row is the index of the hovered row.

## Advanced

For advanced actions, one may need to access to the underlying `ChartWrapper` creating the charts.

```html
<google-chart #chart></google-chart>
```

```typescript
import { ViewChild } from '@angular/core';
import { GoogleChartComponent } from 'angular-google-charts';

@Component({
  ...
})
export class AppComponent implements OnInit {
  @ViewChild('chart')
  chart: GoogleChartComponent;

  ngOnInit() {
    const wrapper = this.chart.wrapper;

    wrapper.draw(myAdvancedData);
  }
}
```

When doing so, you are completely free to create the chart by yourself. Please refer to the (ChartWrapper Documentation)[https://developers.google.com/chart/interactive/docs/reference#chartwrapper-class] on how to do this.

## Custom Components

For some specific types of Google Charts, it may be required to create a custom component. To be able to do so, the ScriptLoaderService (the service that loads the GoogleCharts Library) can be injected into your component.

```typescript
constructor( private loaderService: ScriptLoaderService ) {}
```

And in your OnInit method (or whereever you'd want to create your chart):

```typescript
ngOnInit() {
  this.loaderService.onReady.subscribe( () => {
    this.loaderService.loadChartPackages(this.type).subscribe(() => {
      // Start creating your chart now
      // Example:
      const formatter = new google.visualization.BarFormat();
    });

  });
}
```

To pass a Chart Type into a Google Chart Package name, you can use the `GoogleChartPackagesHelper`.

```typescript
const type = GoogleChartPackagesHelper.getPackageForChartName('BarChart');
```

## AngularCLI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## License

This project is provided under the [MIT license](https://github.com/FERNman/angular-google-charts/blob/master/LICENSE.md).
