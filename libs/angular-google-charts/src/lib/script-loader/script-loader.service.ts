import { Inject, Injectable, LOCALE_ID, NgZone, Optional } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { GoogleChartsConfig } from '../models/google-charts-config.model';
import { GOOGLE_CHARTS_CONFIG } from '../models/injection-tokens.model';

const DEFAULT_CONFIG: GoogleChartsConfig = {
  mapsApiKey: '',
  version: 'current',
  safeMode: false
};

@Injectable({ providedIn: 'root' })
export class ScriptLoaderService {
  private readonly scriptSource = 'https://www.gstatic.com/charts/loader.js';
  private readonly onLoadSubject = new Subject<void>();

  constructor(
    private zone: NgZone,
    @Inject(LOCALE_ID) private localeId: string,
    @Inject(GOOGLE_CHARTS_CONFIG) @Optional() private config?: GoogleChartsConfig
  ) {
    this.config = { ...DEFAULT_CONFIG, ...(config || {}) };
  }

  /**
   * A stream that emits as soon as the google charts script is loaded (i.e. `google.charts` is available).
   * Emits immediately if the script is already loaded.
   *
   * *This does not indicate if loading a chart package is done.*
   */
  public get loadingComplete$(): Observable<void> {
    if (this.isGoogleChartsAvailable()) {
      return of(null);
    }

    return this.onLoadSubject.asObservable();
  }

  /**
   * Checks whether `google.charts` is available.
   *
   * If not, it can be loaded by calling {@link ScriptLoaderService#loadChartPackages loadChartPackages()} or
   * {@link ScriptLoaderService#loadGoogleCharts loadGoogleCharts()}.
   *
   * @returns `true` if `google.charts` is available, `false` otherwise.
   */
  public isGoogleChartsAvailable(): boolean {
    if (typeof google === 'undefined' || typeof google.charts === 'undefined') {
      return false;
    }

    return true;
  }

  /**
   * Loads the Google Chart script and the provided chart packages.
   * Can be called multiple times to load more packages.
   *
   * @param packages The packages to load.
   * @returns A stream emitting as soon as the chart packages are loaded.
   */
  public loadChartPackages(...packages: string[]): Observable<void> {
    return this.loadGoogleCharts().pipe(
      switchMap(() => {
        return new Observable<void>(observer => {
          const config = {
            packages,
            language: this.localeId,
            mapsApiKey: this.config.mapsApiKey,
            safeMode: this.config.safeMode
          };

          google.charts.load(this.config.version, config);
          google.charts.setOnLoadCallback(() => {
            this.zone.run(() => {
              observer.next();
              observer.complete();
            });
          });
        });
      })
    );
  }

  /**
   * Loads the Google Charts script. After the script is loaded, `google.charts` is defined
   * and individual chart packages can be loaded.
   *
   * This should be used if you want only the Google Charts script without a chart package.
   * Most of the times, you want to use {@link ScriptLoaderService#loadChartPackages loadChartPackages()} instead,
   * which uses this method to load chart packages.
   *
   * @returns A stream emitting as soon as loading has completed.
   * If the google charts script is already loaded, the stream emits immediately.
   */
  public loadGoogleCharts() {
    if (!this.isGoogleChartsAvailable() && !this.isLoadingGoogleCharts()) {
      const script = this.createGoogleChartsScript();
      script.onload = () => {
        this.zone.run(() => {
          this.onLoadSubject.next();
          this.onLoadSubject.complete();
        });
      };

      script.onerror = () => {
        this.zone.run(() => {
          console.error('Failed to load the google chart script!');
          this.onLoadSubject.error('Failed to load the google chart script!');
        });
      };
    }

    return this.loadingComplete$;
  }

  private isLoadingGoogleCharts() {
    return this.getGoogleChartsScript() != null;
  }

  private getGoogleChartsScript(): HTMLScriptElement | null {
    const pageScripts = Array.from(document.getElementsByTagName('script'));
    return pageScripts.find(script => script.src === this.scriptSource);
  }

  private createGoogleChartsScript(): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = this.scriptSource;
    script.async = true;
    document.getElementsByTagName('head')[0].appendChild(script);
    return script;
  }
}
