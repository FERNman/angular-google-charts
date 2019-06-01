import { TestBed, async } from '@angular/core/testing';
import { Provider } from '@angular/core';

import { ScriptLoaderService } from './script-loader.service';

const SCRIPT_LOADER_PROVIDER: Provider[] = [
  {
    provide: ScriptLoaderService,
    useFactory: () => new ScriptLoaderService('en-US', null, '46')
  }
];

describe('ScriptLoaderService', () => {
  let service: ScriptLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScriptLoaderService, SCRIPT_LOADER_PROVIDER]
    });

    service = TestBed.get(ScriptLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a script object', () => {
    const googleLoaderScript = getGoogleLoaderScript();
    expect(googleLoaderScript).toBeTruthy();
  });

  describe('script loading tests', () => {
    // TODO: Refactor these so to really check stuff

    it('#doneLoading should be false before the script is loaded', () => {
      if (typeof google === 'undefined') {
        expect(service.doneLoading).toBeFalsy();
      }
    });

    it('#doneLoading should be false if another google package has already loaded, but GoogleCharts is not loaded', () => {
      if (typeof google === 'undefined' || typeof google.charts === 'undefined') {
        expect(service.doneLoading).toBeFalsy();
      }
    });

    it('should successfully load the google charts script', async(() => {
      service.onReady.subscribe(() => {
        expect(google.charts).not.toBeUndefined();
        expect(service.doneLoading).toBeTruthy();
      });
    }));
  });

  describe('package loading tests', () => {
    it('#loadPackages should load the passed packages', async(() => {
      service.onReady.subscribe(() => {
        service.loadChartPackages(['corechart', 'bar']).subscribe(() => {
          const loadedCharts = [
            'AreaChart',
            'BarChart',
            'BubbleChart',
            'CandlestickChart',
            'ColumnChart',
            'ComboChart',
            'PieChart',
            'Histogram',
            'LineChart',
            'ScatterChart',
            'SteppedAreaChart'
          ];

          loadedCharts.forEach(chart => {
            expect(hasKey(google.visualization, chart)).toBeTruthy('Didn\'t load ' + chart);
          });

          expect(hasKey(google.charts, 'Bar')).toBeTruthy('Didn\'t load Material Bar Chart');
        });
      });
    }));

    it('#loadPackages should be callable twice', async(() => {
      service.onReady.subscribe(() => {
        service.loadChartPackages(['treemap']).subscribe(() => {
          expect(hasKey(google.visualization, 'TreeMap')).toBeTruthy('Didn\'t load TreeMap chart.');
        });

        service.loadChartPackages(['table']).subscribe(() => {
          expect(hasKey(google.visualization, 'Table')).toBeTruthy('Didn\'t load Table chart.');
        });
      });
    }));

    it('after initial doneLoading, onReady should still fire', async(() => {
      service.onReady.subscribe(() => {
        expect(service.doneLoading).toBeTruthy();

        service.onReady.subscribe(() => {
          expect(service.doneLoading).toBeTruthy();
        });
      });
    }));

    function hasKey(obj: object, key: string): boolean {
      return obj.hasOwnProperty(key);
    }
  });

  function getGoogleLoaderScript() {
    const scripts = Array.from(document.getElementsByTagName('script'));
    const googleLoaderScript = scripts.find(
      script => script.src === 'https://www.gstatic.com/charts/loader.js' && script.type === 'text/javascript'
    );

    return googleLoaderScript;
  }
});
