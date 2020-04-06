# Configuring Angular Google Charts

For some use cases, it might be necessary to use different config options than the default values.

All config options for Angular Google Charts are provided through a config object, which can be passed to the library by importing the `GoogleChartsModule` using its `forRoot` method.

```typescript
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
  ...
  imports: [
    ...
    GoogleChartsModule.forRoot({ version: 'chart-version' }),
    ...
  ],
  ...
})
export class AppModule {}
```

## Providing a Google Maps API Key

When using Geocharts or Map Charts, it might be necessary to provide a Maps API Key to avoid
the default request throttling of Googles servers.

The Google Maps API Key can be configured using the `mapsApiKey` property in the config.

## Using a specific version of Google Charts

You may want to specify a custom version of Google Charts, e.g. `'upcoming'`.
More information on this can be found in the [official documentation](https://developers.google.com/chart/interactive/docs/basic_load_libs).

The version can be configured using the `version` property in the config.

## Sanitizing unsafe HTML

Since version 47, Google Charts allows you to sanitize generated HTML and will automatically strip unsafe elements.
You can enable this behaviour by setting `safeMode` to true.
