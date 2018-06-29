import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ScriptLoaderService {
  private onLoadSubject = new Subject<boolean>();

  constructor(
    @Inject(LOCALE_ID) private localeId: string
  ) {
    this.initialize();
  }

  public get onLoad(): Observable<boolean> {
    return this.onLoadSubject.asObservable();
  }

  private initialize() {
    const script = this.createScriptelement();

    script.onload = () => this.loadCharts();
    script.onerror = () => {
      console.error("Failed to load the google chart script!");
      this.onLoadSubject.error("Failed to load the google chart script!");
      this.onLoadSubject.complete();
    }
  }

  private createScriptelement(): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.async = true;
    document.getElementsByTagName('head')[0].appendChild(script);
    return script;
  }

  private loadCharts(): void {
    const config = {
      packages: ['corechart'],
      language: this.localeId
    };

    google.charts.load('45.2', config);
    google.charts.setOnLoadCallback(() => {
      this.onLoadSubject.next(true);
      this.onLoadSubject.complete();
    });
  }
}
