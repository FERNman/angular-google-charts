import { TestBed } from '@angular/core/testing';

import { GoogleChartsModule } from './google-charts.module';
import { CHART_VERSION, MAPS_API_KEY } from './models/injection-tokens.model';
import { ScriptLoaderService } from './script-loader/script-loader.service';

describe('GoogleChartsModule', () => {
  let service: ScriptLoaderService;

  describe('direct import', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GoogleChartsModule]
      });
    });

    it('should allow instantiation of `ScriptLoaderService`', () => {
      service = TestBed.inject(ScriptLoaderService);
      expect(service).toBeTruthy();
    });
  });

  describe('config via forRoot', () => {
    const mapsApiKey = 'myMapsApiKey';
    const version = '13.5';

    it('should provide the given config values', () => {
      TestBed.configureTestingModule({
        imports: [GoogleChartsModule.forRoot({ mapsApiKey, version })]
      });

      expect(TestBed.inject(CHART_VERSION)).toBe(version);
      expect(TestBed.inject(MAPS_API_KEY)).toBe(mapsApiKey);
    });

    it('should accept empty config', () => {
      TestBed.configureTestingModule({
        imports: [GoogleChartsModule.forRoot()]
      });

      expect(TestBed.inject(CHART_VERSION)).toBeUndefined();
      expect(TestBed.inject(MAPS_API_KEY)).toBeUndefined();
    });

    it('should accept a partial config', () => {
      TestBed.configureTestingModule({
        imports: [GoogleChartsModule.forRoot({ mapsApiKey })]
      });

      expect(TestBed.inject(CHART_VERSION)).toBeUndefined();
      expect(TestBed.inject(MAPS_API_KEY)).toBe(mapsApiKey);
    });
  });
});
