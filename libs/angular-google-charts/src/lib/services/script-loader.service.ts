import { Inject, Injectable, LOCALE_ID, NgZone, Optional } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { GoogleChartsConfig, GOOGLE_CHARTS_CONFIG } from '../types/google-charts-config';

const DEFAULT_CONFIG: GoogleChartsConfig = {
  version: 'current',
  safeMode: false
};

@Injectable()
export class ScriptLoaderService {
  private readonly scriptSource = 'https://www.gstatic.com/charts/loader.js';
  private readonly scriptLoadSubject = new Subject<null>();
  private readonly config: GoogleChartsConfig;

  constructor(
    private zone: NgZone,
    @Inject(LOCALE_ID) private localeId: string,
    @Inject(GOOGLE_CHARTS_CONFIG) @Optional() config?: GoogleChartsConfig
  ) {
    this.config = { ...DEFAULT_CONFIG, ...(config || {}) };
  }

  /**
   * Checks whether `google.charts` is available.
   *
   * If not, it can be loaded by calling `loadChartPackages`.
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
   * When called without any arguments, this will just load the default package
   * containing the namespaces `google.charts` and `google.visualization` without any charts.
   *
   * @param packages The packages to load.
   * @returns A stream emitting as soon as the chart packages are loaded.
   */
  public loadChartPackages(...packages: string[]): Observable<null> {
    return this.loadGoogleCharts().pipe(
      switchMap(() => {
        return new Observable<null>(observer => {
          const config = {
            packages,
            language: this.localeId,
            mapsApiKey: this.config.mapsApiKey,
            safeMode: this.config.safeMode
          };

          google.charts.load(this.config.version!, config);
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
   * Loads the Google Charts script. After the script is loaded, `google.charts` is defined.
   *
   * @returns A stream emitting as soon as loading has completed.
   * If the google charts script is already loaded, the stream emits immediately.
   */
  private loadGoogleCharts(): Observable<null> {
    if (this.isGoogleChartsAvailable()) {
      return of(null);
    } else if (!this.isLoadingGoogleCharts()) {
      const script = this.createGoogleChartsScript();
      script.onload = () => {
        this.zone.run(() => {
          this.scriptLoadSubject.next();
          this.scriptLoadSubject.complete();
        });
      };

      script.onerror = () => {
        this.zone.run(() => {
          console.error('Failed to load the google charts script!');
          this.scriptLoadSubject.error(new Error('Failed to load the google charts script!'));
        });
      };
    }

    return this.scriptLoadSubject.asObservable();
  }

  private isLoadingGoogleCharts() {
    return this.getGoogleChartsScript() != null;
  }

  private getGoogleChartsScript(): HTMLScriptElement | undefined {
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
