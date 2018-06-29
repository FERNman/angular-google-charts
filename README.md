# Angular-Google-Charts

This library provides a wrapper of the [Google Charts](https://google-developers.appspot.com/chart/) library for Angular 6+. It is built with the AngularCLI and includes some examples.

## Setup

To use Angular-Google-Charts in your project, install the package with npm by calling

```
npm install angular-google-charts
```

This will add the package to your package.json and install the required dependencies. Next, import `GoogleChartsModule` into one of your modules.

## Charts

To create a chart, simply create an object using the provided component.

```html
<google-chart></google-chart>
```

The component provides a few input properties for convenience.

### Type (required): `string`

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

For more chart types and information, please see the [google chart gallery](https://google-developers.appspot.com/chart/interactive/docs/gallery);

### Data (required): `Array<Array<any>>`

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

### Data Titles (required for most charts): `Array<string>`

```html
<google-chart [dataTitles]="myDataTitles"></google-chart>
```

The `titles` property expects an `Array<string>` containing the titles for each column of the chart data. The number of entries must match the length of the inner array passed in the `data` property.
Some charts don't require titles. Whether your chart requires it can be check in the official documentation.

```typescript
myDataTitles = ['City', 'Inhabitants'];
```

### Roles: `Array<object>`

```html
<google-chart [roles]="myRoles"></google-chart>
```

The `roles` property is optional and can be used for additional, row specific styling options. If provided, the length of the array must match the length of the roles provided in each of the inner arrays of the data object.

```typescript
myRoles = [
  { role: 'style' }
];

myData = [
  ['Element', 10.5, '#ffaaff'] // The last entry in the array is the role
];
```

For further information, please see the [google documentation](https://google-developers.appspot.com/chart/interactive/docs/roles).

### Title: `string`

```html
<google-chart [title]="myTitle"></google-chart>
```

The `title` property is optional and provided for convenice. It can also be included in the `options` property.

### Width: `number`

```html
<google-chart [width]="myWidth"></google-chart>
```

The `width` property is optional and allows to set the width of the chart. The number provided will be converted to a pixel value. The default is `400px`.
It should be used instead of the `width` property in the `options` object.

### Height: `number`

```html
<google-chart [height]="myHeight"></google-chart>
```

The `height` property is optional and allows to set the height of the chart. The number provided will be converted to a pixel value. The default is `400px`.
It should be used instead of the `height` property in the `options` object.

### Options: `object`

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
