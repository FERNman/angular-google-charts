import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ScriptLoaderService {
  private readonly scriptSource = 'https://www.gstatic.com/charts/loader.js';

  private onLoadSubject = new Subject<boolean>();

  constructor(
    @Inject(LOCALE_ID) private localeId: string
  ) {
    this.initialize();
  }

  public get onReady(): Observable<boolean> {
    if (this.doneLoading) {
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }

    return this.onLoadSubject.asObservable();
  }

  public get doneLoading(): boolean {
    if (typeof(google) !== 'undefined') {
      return true;
    }

    return false;
  }

  private get isLoading(): boolean {
    if (typeof(google) === 'undefined') {
      const pageScripts = Array.from(document.getElementsByTagName('script'));
      return pageScripts.findIndex(script => script.src === this.scriptSource) >= 0;
    }

    return false;
  }

  public loadChartPackages(packages: Array<string>): Observable<any> {
    return Observable.create(observer => {
      const config = {
        packages: packages,
        language: this.localeId
      };

      google.charts.load('45.2', config);
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
