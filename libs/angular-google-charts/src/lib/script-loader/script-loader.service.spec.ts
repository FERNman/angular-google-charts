import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { GOOGLE_CHARTS_CONFIG } from '../models/injection-tokens.model';

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
    globalThis.google = undefined;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadingComplete$', () => {
    it('should emit immediately if `google.charts` is available', () => {
      globalThis.google = {
        charts: { load: () => {} }
      } as any;

      const spy = jest.fn();
      service.loadingComplete$.subscribe(() => spy());
      expect(spy).toHaveBeenCalled();
    });

    it('should return the `onLoadSubject` if `google.charts` is not yet available', () => {
      const spy = jest.fn();
      service.loadingComplete$.subscribe(() => spy());
      expect(spy).not.toHaveBeenCalled();

      service['onLoadSubject'].next();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('isGoogleChartsAvailable', () => {
    it('should be false if `google` is not available', () => {
      expect(service.isGoogleChartsAvailable()).toBeFalsy();
    });

    it('should be false if another google package is loaded, but `google.charts` is not available', () => {
      globalThis.google = { someOtherPackage: {} } as any;

      expect(service.isGoogleChartsAvailable()).toBeFalsy();
    });

    it('should successfully load the google charts script', () => {
      globalThis.google = {
        charts: { load: () => {} }
      } as any;

      expect(service.isGoogleChartsAvailable()).toBeTruthy();
    });
  });

  describe('loadChartPackages', () => {
    const chartsMock = {
      load: jest.fn(),
      setOnLoadCallback: jest.fn()
    };

    beforeEach(() => {
      globalThis.google = { charts: chartsMock } as any;
    });

    it('should load `google.charts` before trying to load packages', () => {
      globalThis.google = undefined;

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

    it('should load the chart packages if `google.charts` is available', () => {
      const chart = 'corechart';

      service.loadChartPackages(chart).subscribe();

      expect(chartsMock.load).toHaveBeenCalledWith('current', {
        packages: [chart],
        language: 'en-US',
        mapsApiKey: '',
        safeMode: false
      });
    });

    it('should emit after loading the charts', () => {
      const chart = 'corechart';
      let loadCallback: Function;

      chartsMock.setOnLoadCallback.mockImplementation(callback => (loadCallback = callback));

      const loadedSpy = jest.fn();
      service.loadChartPackages(chart).subscribe(() => loadedSpy());

      expect(loadedSpy).not.toHaveBeenCalled();

      loadCallback();
      expect(loadedSpy).toHaveBeenCalled();
    });

    it('should use injected config values', () => {
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
  });

  describe('loadGoogleCharts', () => {
    let createElementSpy: jest.SpyInstance;
    let getElementsByTagNameSpy: jest.SpyInstance;

    beforeEach(() => {
      createElementSpy = jest.spyOn(document, 'createElement').mockImplementation();
      getElementsByTagNameSpy = jest.spyOn(document, 'getElementsByTagName').mockImplementation();
    });

    it('should do nothing if `google.charts` is available', () => {
      globalThis.google = {
        charts: { load: () => {} }
      } as any;

      service.loadGoogleCharts().subscribe();

      expect(createElementSpy).not.toHaveBeenCalled();
    });

    it('should do nothing if script is already being loaded', () => {
      getElementsByTagNameSpy.mockReturnValue([{ src: service['scriptSource'] }]);

      service.loadGoogleCharts().subscribe();

      expect(createElementSpy).not.toHaveBeenCalled();
    });

    it('should create the google charts script', () => {
      createElementSpy.mockReturnValue({});

      const headMock = { appendChild: jest.fn() };
      getElementsByTagNameSpy.mockReturnValueOnce([]).mockReturnValueOnce([headMock]);

      service.loadGoogleCharts().subscribe();

      expect(createElementSpy).toHaveBeenCalledWith('script');
      expect(headMock.appendChild).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'text/javascript',
          src: service['scriptSource'],
          async: true
        })
      );
    });

    it('should emit as soon as the script is fully loaded', () => {
      const scriptMock = { onload: () => {} };
      createElementSpy.mockReturnValue(scriptMock);

      const headMock = { appendChild: jest.fn() };
      getElementsByTagNameSpy.mockReturnValueOnce([]).mockReturnValueOnce([headMock]);

      const loadedSpy = jest.fn();
      service.loadGoogleCharts().subscribe(() => loadedSpy());

      expect(loadedSpy).not.toHaveBeenCalled();
      scriptMock.onload();

      expect(loadedSpy).toHaveBeenCalled();
    });

    it('should emit error if the script fails to load', () => {
      const scriptMock = { onerror: () => void 0 };
      createElementSpy.mockReturnValue(scriptMock);

      const headMock = { appendChild: jest.fn() };
      getElementsByTagNameSpy.mockReturnValueOnce([]).mockReturnValueOnce([headMock]);

      const errorSpy = jest.fn();
      service
        .loadGoogleCharts()
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
});
