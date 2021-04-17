import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { getDefaultConfig } from '../helpers/chart.helper';
import { GoogleChartsConfig, GOOGLE_CHARTS_CONFIG, GOOGLE_CHARTS_LAZY_CONFIG } from '../types/google-charts-config';

import { ScriptLoaderService } from './script-loader.service';

describe('ScriptLoaderService', () => {
  let service: ScriptLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScriptLoaderService]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ScriptLoaderService);
    (globalThis as any).google = undefined;
  });

  describe('isGoogleChartsAvailable', () => {
    it('should be false if `google` is not available', () => {
      expect(service.isGoogleChartsAvailable()).toBeFalsy();
    });

    it('should be false if another google package is loaded, but `google.charts` is not available', () => {
      globalThis.google = { someOtherPackage: {} } as any;

      expect(service.isGoogleChartsAvailable()).toBeFalsy();
    });

    it('should be true if `google.charts` and `google.visulization` is available', () => {
      globalThis.google = {
        charts: { load: () => {} },
        visulization: { arrayToDataTable: () => {} }
      } as any;

      expect(service.isGoogleChartsAvailable()).toBeTruthy();
    });
  });

  describe('loadChartPackages', () => {
    it('should load the google charts script before trying to load packages', () => {
      const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({} as any);

      const headMock = { appendChild: jest.fn() };
      jest
        .spyOn(document, 'getElementsByTagName')
        .mockReturnValueOnce([] as any)
        .mockReturnValueOnce([headMock] as any);

      service.loadChartPackages().subscribe();

      expect(createElementSpy).toHaveBeenCalledWith('script');
      expect(headMock.appendChild).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'text/javascript',
          src: service['scriptSource'],
          async: true
        })
      );
    });

    describe('loading the charts script', () => {
      let createElementSpy: jest.SpyInstance;
      let getElementsByTagNameSpy: jest.SpyInstance;

      beforeEach(() => {
        createElementSpy = jest.spyOn(document, 'createElement').mockImplementation();
        getElementsByTagNameSpy = jest.spyOn(document, 'getElementsByTagName').mockImplementation();
      });

      it('should not load the script if it is already loaded', () => {
        globalThis.google = {
          charts: { load: () => {} }
        } as any;

        service.loadChartPackages().subscribe();

        expect(createElementSpy).not.toHaveBeenCalled();
      });

      it('should not load the script if it is currently being loaded', () => {
        getElementsByTagNameSpy.mockReturnValue([{ src: service['scriptSource'] }]);

        service.loadChartPackages().subscribe();

        expect(createElementSpy).not.toHaveBeenCalled();
      });

      it('should load the google charts script', () => {
        createElementSpy.mockReturnValue({});

        const headMock = { appendChild: jest.fn() };
        getElementsByTagNameSpy.mockReturnValueOnce([]).mockReturnValueOnce([headMock]);

        service.loadChartPackages().subscribe();

        expect(createElementSpy).toHaveBeenCalledWith('script');
        expect(headMock.appendChild).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'text/javascript',
            src: service['scriptSource'],
            async: true
          })
        );
      });

      it('should emit an error if the script fails to load', () => {
        const scriptMock = { onerror: () => void 0 };
        createElementSpy.mockReturnValue(scriptMock);

        const headMock = { appendChild: jest.fn() };
        getElementsByTagNameSpy.mockReturnValueOnce([]).mockReturnValueOnce([headMock]);

        const errorSpy = jest.fn();
        service
          .loadChartPackages()
          .pipe(
            catchError(error => {
              errorSpy();
              return throwError(error);
            })
          )
          .subscribe();

        expect(errorSpy).not.toHaveBeenCalled();

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        scriptMock.onerror();
        consoleSpy.mockReset();

        expect(errorSpy).toHaveBeenCalled();
      });
    });

    describe('loading chart packages', () => {
      const chartsMock = {
        load: jest.fn(),
        setOnLoadCallback: jest.fn()
      };

      it('should load the chart packages after loading the google charts script', () => {
        const scriptMock = { onload: () => {} };

        jest.spyOn(document, 'createElement').mockReturnValue(scriptMock as any);

        const headMock = { appendChild: jest.fn() };
        jest
          .spyOn(document, 'getElementsByTagName')
          .mockReturnValueOnce([] as any)
          .mockReturnValueOnce([headMock] as any);

        service.loadChartPackages().subscribe();

        globalThis.google = { charts: chartsMock } as any;
        scriptMock.onload();

        expect(chartsMock.load).toHaveBeenCalledWith('current', {
          packages: [],
          language: 'en-US',
          mapsApiKey: undefined,
          safeMode: false
        });
      });

      it('should immediately load the chart packages if the google charts script is already loaded', () => {
        globalThis.google = { charts: chartsMock } as any;

        const chart = 'corechart';

        service.loadChartPackages(chart).subscribe();

        expect(chartsMock.load).toHaveBeenCalledWith('current', {
          packages: [chart],
          language: 'en-US',
          mapsApiKey: undefined,
          safeMode: false
        });
      });

      it('should emit after loading the charts', () => {
        globalThis.google = { charts: chartsMock } as any;

        const chart = 'corechart';
        let loadCallback: Function;

        chartsMock.setOnLoadCallback.mockImplementation(callback => (loadCallback = callback));

        const loadedSpy = jest.fn();
        service.loadChartPackages(chart).subscribe(() => loadedSpy());

        expect(loadedSpy).not.toHaveBeenCalled();

        expect(loadCallback!).toBeTruthy();
        loadCallback!();
        expect(loadedSpy).toHaveBeenCalled();
      });

      it('should use injected config values', () => {
        globalThis.google = { charts: chartsMock } as any;

        TestBed.resetTestingModule();

        const version = 'current';
        const mapsApiKey = 'mapsApiKey';
        const safeMode = true;
        const locale = 'de-DE';

        TestBed.configureTestingModule({
          providers: [
            ScriptLoaderService,
            { provide: LOCALE_ID, useValue: locale },
            { provide: GOOGLE_CHARTS_CONFIG, useValue: { version, mapsApiKey, safeMode } }
          ]
        });
        service = TestBed.inject(ScriptLoaderService);

        const chart = 'corechart';

        service.loadChartPackages(chart).subscribe();

        expect(chartsMock.load).toHaveBeenCalledWith(version, {
          packages: [chart],
          language: locale,
          mapsApiKey,
          safeMode
        });
      });

      it('should use injected lazy config values', () => {
        globalThis.google = { charts: chartsMock } as any;

        TestBed.resetTestingModule();

        const mapsApiKey = 'mapsApiKey';
        const safeMode = false;
        const locale = 'en-US';
        const lazyConfigSubject = new Subject<GoogleChartsConfig>();

        TestBed.configureTestingModule({
          providers: [
            ScriptLoaderService,
            { provide: LOCALE_ID, useValue: locale },
            { provide: GOOGLE_CHARTS_LAZY_CONFIG, useValue: lazyConfigSubject.asObservable() }
          ]
        });
        service = TestBed.inject(ScriptLoaderService);

        const chart = 'corechart';

        service.loadChartPackages(chart).subscribe();

        expect(chartsMock.load).not.toHaveBeenCalled();

        lazyConfigSubject.next({ mapsApiKey, safeMode });

        expect(chartsMock.load).toHaveBeenCalledWith(getDefaultConfig().version, {
          packages: [chart],
          language: locale,
          mapsApiKey,
          safeMode
        });
      });
    });
  });
});
