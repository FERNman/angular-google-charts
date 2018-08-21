import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ScriptLoaderService {
  private onLoadSubject = new Subject<boolean>();

  private doneLoading = false;

  constructor(
    @Inject(LOCALE_ID) private localeId: string
  ) {
    this.initialize();
  }

  public get onLoad(): Observable<boolean> {
    return this.onLoadSubject.asObservable();
  }

  public get loaded(): boolean {
    return this.doneLoading;
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
    if (!this.doneLoading) {
      const script = this.createScriptElement();

      script.onload = () => {
        this.doneLoading = true;
        this.onLoadSubject.next(true);
        this.onLoadSubject.complete();
      };

      script.onerror = () => {
        console.error("Failed to load the google chart script!");
        this.onLoadSubject.error("Failed to load the google chart script!");
        this.onLoadSubject.complete();
      };
    }
  }

  private createScriptElement(): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.async = true;
    document.getElementsByTagName('head')[0].appendChild(script);
    return script;
  }
}
