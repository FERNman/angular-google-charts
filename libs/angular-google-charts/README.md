# angular-google-charts

> A wrapper for the [Google Charts library](https://google-developers.appspot.com/chart/) written in Angular.

## Install

With [npm](https://npmjs.org/) installed, run

```bash
npm install angular-google-charts
```

## Usage

Import the `GoogleChartsModule` in your `app.module.ts`:

```typescript
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
  ...
  imports: [
    ...
    GoogleChartsModule,
    ...
  ],
  ...
})
export class AppModule {}
```

And create a `google-chart` component somewhere in your application:

```html
<google-chart
  [title]="chart.title"
  [type]="chart.type"
  [data]="chart.data"
  [columns]="chart.columnNames"
  [options]="chart.options"
>
</google-chart>
```

## Detailed Instructions

Find the full readme at [GitHub](https://github.com/FERNman/angular-google-charts).

## License

MIT
