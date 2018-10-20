import { TestBed } from '@angular/core/testing';

import { GoogleChartsModule } from './google-charts.module';
import { ScriptLoaderService } from './script-loader/script-loader.service';

describe('GoogleChartsModule', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ GoogleChartsModule ]
        });
    });

    it('should provide ScriptLoaderService', () => {
        expect(() => TestBed.get(ScriptLoaderService).toBeTruthy());
    });
});

describe('GoogleChartsModule.forRoot()', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ GoogleChartsModule.forRoot('myMapsApiKey') ]
        });
    });

    it('should provide ScriptLoaderService', () => {
        expect(() => TestBed.get(ScriptLoaderService).toBeTruthy());
    });
});