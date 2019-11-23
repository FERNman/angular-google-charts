import { TestBed } from '@angular/core/testing';

import { GoogleChartsModule } from './google-charts.module';
import { ScriptLoaderService } from './script-loader/script-loader.service';

describe('GoogleChartsModule', () => {
  let service: ScriptLoaderService;

  describe('direct import', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GoogleChartsModule]
      });
    });

    beforeEach(() => {
      service = TestBed.get(ScriptLoaderService);
    });

    it('should provide ScriptLoaderService', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('forRoot()', () => {
    const apiKey = 'myMapsApiKey';

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GoogleChartsModule.forRoot(apiKey)]
      });
    });

    beforeEach(() => {
      service = TestBed.get(ScriptLoaderService);
    });

    it('should provide ScriptLoaderService', () => {
      expect(service).toBeTruthy();
    });

    it('should have the correct api key set', () => {
      const injectedKey = (service as any).googleApiKey;
      expect(injectedKey).toEqual(apiKey);
    });
  });
});
