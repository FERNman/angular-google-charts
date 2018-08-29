import { TestBed, async } from '@angular/core/testing';

import { ScriptLoaderService } from './script-loader.service';

describe('ScriptLoaderService', () => {

  let service: ScriptLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScriptLoaderService]
    });

    service = TestBed.get(ScriptLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a script object', () => {
    const scripts = Array.from(document.getElementsByTagName('script'));
    const googleLoaderScript = scripts.find(
      script => script.src === 'https://www.gstatic.com/charts/loader.js' && script.type === 'text/javascript');
    expect(googleLoaderScript).toBeTruthy();
  });

  it('should successfully load the google charts package', async(() => {
    service.onReady.subscribe(() => {
      expect(google.charts).not.toBeUndefined();
    });
  }));

  it('#doneLoading should match whether google is already loaded', () => {
    if (typeof(google) === 'undefined') {
      expect(service.doneLoading).toBeFalsy();
    } else {
      expect(service.doneLoading).toBeTruthy();
    }
  });

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
          'SteppedAreaChart',
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
        expect(hasKey(google.visualization, 'TreeMap')).toBeTruthy();
      });

      service.loadChartPackages(['table']).subscribe(() => {
        expect(hasKey(google.visualization, 'Table')).toBeTruthy();
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
