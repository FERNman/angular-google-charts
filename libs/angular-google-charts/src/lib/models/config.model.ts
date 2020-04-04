export interface Config {
  /**
   * A Google Maps API key, used for GeoCharts.
   *
   * {@link https://developers.google.com/chart/interactive/docs/gallery/geochart GeoChart Documentation}
   */
  mapsApiKey?: string;
  /**
   * Which version of Google Charts to use.
   * Can be either a number specifying the concrete version (e.g. `45`, `45.1`) or a string (e.g. `'upcoming'`).
   *
   * {@link https://developers.google.com/chart/interactive/docs/basic_load_libs#basic-library-loading Offical Documentation}
   */
  version?: string;
}
