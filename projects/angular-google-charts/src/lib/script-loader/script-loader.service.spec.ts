import { TestBed, inject, async } from '@angular/core/testing';

import { ScriptLoaderService } from './script-loader.service';

describe('ScriptLoaderService', () => {

  let service: ScriptLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScriptLoaderService]
    });

    service = TestBed.get(ScriptLoaderService);
  });

  /*it('should be created', () => {
    expect(service).toBeTruthy();
  });*/

  it('should successfully load the google charts package on creation', (done: DoneFn) => {
    service.onLoad.subscribe(() => {
      var scripts = Array.from(document.getElementsByTagName("script"));
      expect(scripts.find(script => script.src === "https://www.gstatic.com/charts/loader.js" && script.type === "text/javascript")).toBeTruthy();

      expect(google.charts).not.toBeUndefined();

      done();
    });
  });

  /*it('#loaded should be false', () => {
    expect(service.loaded).toBeFalsy();

    var scripts = Array.from(document.getElementsByTagName("script"));
    expect(scripts.find(script => script.src === "https://www.gstatic.com/charts/loader.js" && script.type === "text/javascript")).toBeTruthy();
  });

  it('#loadPackages should load the passed packages', (done: DoneFn) => {
    service.onLoad.subscribe(() => {
      service.loadChartPackages(['corecharts', 'bar']).subscribe(() => {
        expect(Object.keys(google.visualization).sort()).toEqual([
          "AreaChart",
          "BarChart",
          "BubbleChart",
          "CandlestickChart",
          "ColumnChart",
          "ComboChart",
          "PieChart",
          "Histogram",
          "LineChart",
          "ScatterChart",
          "SteppedAreaChart",
          "Bar"
        ].sort());

        done();
      });
    });
  });

  it('#loadPackages should be callable twice', (done: DoneFn) => {
    service.onLoad.subscribe(() => {
      done();
    });
  });*/
});
