import { Inject, Injectable, LOCALE_ID, Optional } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

import { CHART_VERSION, MAPS_API_KEY } from '../models/injection-tokens.model';

@Injectable({ providedIn: 'root' })
export class ScriptLoaderService {
  private readonly scriptSource = 'https://www.gstatic.com/charts/loader.js';

  private onLoadSubject = new Subject<boolean>();

  constructor(
    @Inject(LOCALE_ID) private localeId: string,
    @Inject(MAPS_API_KEY) @Optional() private mapsApiKey?: string,
    @Inject(CHART_VERSION) @Optional() private chartVersion?: string
  ) {
    this.initialize();
  }

  public get onReady(): Observable<boolean> {
    if (this.doneLoading) {
      return of(true);
    }

    return this.onLoadSubject.asObservable();
  }

  public get doneLoading(): boolean {
    if (typeof google === 'undefined' || typeof google.charts === 'undefined') {
      return false;
    }

    return true;
  }

  private get isLoading(): boolean {
    if (this.doneLoading) {
      return false;
    }

    const pageScripts = Array.from(document.getElementsByTagName('script'));
    const googleChartsScript = pageScripts.find(script => script.src === this.scriptSource);
    return googleChartsScript !== undefined;
  }

  public loadChartPackages(packages: string[]): Observable<void> {
    return new Observable(observer => {
      const config = {
        packages: packages,
        language: this.localeId,
        mapsApiKey: this.mapsApiKey || ''
      };

      google.charts.load(this.chartVersion || '46', config);
      google.charts.setOnLoadCallback(() => {
        observer.next();
        observer.complete();
      });
    });
  }

  private initialize() {
    if (!this.doneLoading && !this.isLoading) {
      const script = this.createScriptElement();

      script.onload = () => {
        this.onLoadSubject.next(true);
        this.onLoadSubject.complete();
      };

      script.onerror = () => {
        console.error('Failed to load the google chart script!');
        this.onLoadSubject.error('Failed to load the google chart script!');
        this.onLoadSubject.complete();
      };
    }
  }

  private createScriptElement(): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = this.scriptSource;
    script.async = true;
    document.getElementsByTagName('head')[0].appendChild(script);
    return script;
  }
}
