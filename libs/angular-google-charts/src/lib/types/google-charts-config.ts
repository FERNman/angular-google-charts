import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface GoogleChartsConfig {
  /**
   * This setting lets you specify a key that you may use with Geochart and Map Chart.
   * You may want to do this rather than using the default behavior which may result in
   * occasional throttling of service for your users.
   *
   * Only available when using Google Charts 45 or higher.
   *
   * {@link https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings Parameter documentation }
   * {@link https://developers.google.com/chart/interactive/docs/gallery/geochart GeoChart Documentation}
   */
  mapsApiKey?: string;

  /**
   * Which version of Google Charts to use.
   *
   * Please note that this library does only work with Google Charts 45 or higher.
   *
   * @description
   * You can provide either a literal string or an observable that emits a string. The value can be either a number specifying a
   * {@link https://developers.google.com/chart/interactive/docs/release_notes#current:-january-6,-2020 frozen version } of Google Charts
   * or one of the special versions `current` and `upcoming`.
   *
   * Defaults to `current`.
   *
   * {@link https://developers.google.com/chart/interactive/docs/basic_load_libs#basic-library-loading Official Documentation}
   */
  version?: string | Observable<string>;

  /**
   * When set to true, all charts and tooltips that generate HTML from user-supplied data will sanitize it
   * by stripping out unsafe elements and attributes.
   *
   * Only available when using GoogleCharts 47 or higher.
   *
   * {@link https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings Parameter documentation }
   */
  safeMode?: boolean;
}

export const GOOGLE_CHARTS_CONFIG = new InjectionToken<GoogleChartsConfig>('GOOGLE_CHARTS_CONFIG');
