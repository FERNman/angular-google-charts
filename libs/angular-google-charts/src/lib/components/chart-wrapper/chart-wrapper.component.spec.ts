import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';

import { ScriptLoaderService } from '../../services/script-loader.service';
import { ChartType } from '../../types/chart-type';
import { ChartErrorEvent, ChartReadyEvent, ChartSelectionChangedEvent } from '../../types/events';

import { ChartWrapperComponent } from './chart-wrapper.component';

jest.mock('../../services/script-loader.service');

const chartWrapperMock = {
  setChartType: jest.fn(),
  setDataTable: jest.fn(),
  setOptions: jest.fn(),
  setContainerId: jest.fn(),
  setDataSourceUrl: jest.fn(),
  setQuery: jest.fn(),
  setRefreshInterval: jest.fn(),
  setView: jest.fn(),
  draw: jest.fn(),
  getChart: jest.fn()
};

const visualizationMock = {
  ChartWrapper: jest.fn(),
  arrayToDataTable: jest.fn(),
  events: {
    addListener: jest.fn(),
    removeAllListeners: jest.fn()
  }
};

describe('ChartWrapperComponent', () => {
  let component: ChartWrapperComponent;
  let fixture: ComponentFixture<ChartWrapperComponent>;

  beforeEach(() => {
    visualizationMock.ChartWrapper.mockReturnValue(chartWrapperMock);
    globalThis.google = { visualization: visualizationMock } as any;
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartWrapperComponent],
      providers: [ScriptLoaderService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartWrapperComponent);
    component = fixture.componentInstance;
    // No change detection here, we want to invoke the
    // lifecycle methods in the unit tests
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load the google charts package', () => {
      const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      scriptLoaderService.loadChartPackages.mockReturnValue(EMPTY);

      component.ngOnInit();

      expect(scriptLoaderService.loadChartPackages).toHaveBeenCalled();
    });

    it('should create the chart wrapper using the provided specs', () => {
      const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      scriptLoaderService.loadChartPackages.mockReturnValue(of(null));

      const specs = { chartType: ChartType.AreaChart, dataTable: [] };
      component.specs = specs;
      component.ngOnInit();

      expect(visualizationMock.ChartWrapper).toHaveBeenCalledWith(expect.objectContaining(specs));
    });

    it('should not throw if the specs are `null`', () => {
      const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      scriptLoaderService.loadChartPackages.mockReturnValue(of(null));
      component.specs = undefined;

      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should not use container or containerId if present in the chart specs', () => {
      const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      scriptLoaderService.loadChartPackages.mockReturnValue(of(null));

      const specs = {
        chartType: ChartType.AreaChart,
        container: { innerHTML: '' } as HTMLElement,
        containerId: 'test'
      };
      component.specs = specs;
      component.ngOnInit();

      expect(visualizationMock.ChartWrapper).not.toHaveBeenCalledWith(
        expect.objectContaining({ container: specs.container })
      );
      expect(visualizationMock.ChartWrapper).not.toHaveBeenCalledWith(
        expect.objectContaining({ containerId: specs.containerId })
      );
    });

    it('should register chart wrapper event handlers', () => {
      const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      scriptLoaderService.loadChartPackages.mockReturnValue(of(null));

      component.specs = { chartType: ChartType.AreaChart };

      component.ngOnInit();

      expect(visualizationMock.events.removeAllListeners).toHaveBeenCalled();
      expect(visualizationMock.events.addListener).toHaveBeenCalledWith(
        chartWrapperMock,
        'ready',
        expect.any(Function)
      );
      expect(visualizationMock.events.addListener).toHaveBeenCalledWith(
        chartWrapperMock,
        'error',
        expect.any(Function)
      );
      expect(visualizationMock.events.addListener).toHaveBeenCalledWith(
        chartWrapperMock,
        'select',
        expect.any(Function)
      );
    });

    it('should emit ready event', () => {
      const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      scriptLoaderService.loadChartPackages.mockReturnValue(of(null));

      component.specs = { chartType: ChartType.AreaChart };

      const readySpy = jest.fn();
      component.wrapperReady$.subscribe(event => readySpy(event));

      component.ngOnInit();

      expect(readySpy).toHaveBeenCalledWith(chartWrapperMock);
    });

    it('should draw the chart', () => {
      const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      scriptLoaderService.loadChartPackages.mockReturnValue(of(null));

      component.specs = { chartType: ChartType.AreaChart };

      component.ngOnInit();

      expect(chartWrapperMock.draw).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      component['wrapper'] = chartWrapperMock as any;
      component['initialized'] = true;
    });

    it('should not throw if the wrapper is not yet initialized', () => {
      component['wrapper'] = undefined;
      component['initialized'] = false;

      const specs = {
        chartType: ChartType.AreaChart
      };

      expect(() => changeSpecs(specs)).not.toThrow();
    });

    it('should update the chart wrapper with the provided specs', () => {
      const specs = {
        chartType: ChartType.AreaChart,
        dataSourceUrl: 'www.data.de',
        dataTable: [],
        options: { test: 'any' },
        query: 'query',
        refreshInterval: 100,
        view: 'testview'
      } as google.visualization.ChartSpecs;

      changeSpecs(specs);

      expect(chartWrapperMock.setChartType).toHaveBeenCalledWith(specs.chartType);
      expect(chartWrapperMock.setDataSourceUrl).toHaveBeenCalledWith(specs.dataSourceUrl);
      expect(chartWrapperMock.setDataTable).toHaveBeenCalledWith(specs.dataTable);
      expect(chartWrapperMock.setOptions).toHaveBeenCalledWith(specs.options);
      expect(chartWrapperMock.setQuery).toHaveBeenCalledWith(specs.query);
      expect(chartWrapperMock.setRefreshInterval).toHaveBeenCalledWith(specs.refreshInterval);
      expect(chartWrapperMock.setView).toHaveBeenCalledWith(specs.view);
    });

    it('should ignore `container` and `containerId` if given', () => {
      const specs = { containerId: 'test', container: {} } as google.visualization.ChartSpecs;
      component.specs = specs;

      expect(chartWrapperMock.setContainerId).not.toHaveBeenCalled();
    });

    it('should not throw if the specs are `undefined`', () => {
      expect(() => changeSpecs(undefined)).not.toThrow();

      expect(chartWrapperMock.draw).toHaveBeenCalled();
    });

    it('should redraw the chart if the specs change', () => {
      const specs = { chartType: ChartType.AreaChart } as google.visualization.ChartSpecs;
      component.specs = specs;

      const newSpecs = { ...specs, chartType: ChartType.GeoChart };
      changeSpecs(newSpecs);

      expect(chartWrapperMock.draw).toHaveBeenCalled();
    });

    it("should not redraw the chart if the specs didn't change", () => {
      const specs = { chartType: ChartType.AreaChart } as google.visualization.ChartSpecs;
      component.specs = specs;

      component.ngOnChanges({});

      expect(chartWrapperMock.draw).not.toHaveBeenCalled();
    });
  });

  describe('chart', () => {
    it('should not throw when trying to access chart if its not yet drawn', () => {
      component['wrapper'] = chartWrapperMock as any;
      expect(() => component.chart).not.toThrow();
    });
  });

  describe('chartWrapper', () => {
    it('should throw if the chart wrapper is `undefined`', () => {
      expect(() => component.chartWrapper).toThrow();
    });

    it('should return the chart wrapper', () => {
      component['wrapper'] = chartWrapperMock as any;

      const wrapper = component.chartWrapper;
      expect(wrapper).toBe(chartWrapperMock);
    });

    it('should redraw if changed', () => {
      component.chartWrapper = chartWrapperMock as any;

      expect(chartWrapperMock.draw).toHaveBeenCalled();
    });
  });

  describe('events', () => {
    beforeEach(() => {
      const service = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      service.loadChartPackages.mockReturnValueOnce(of(null));
    });

    it('should emit ready event after the chart is ready', () => {
      const chartMock = { draw: jest.fn() };
      chartWrapperMock.getChart.mockReturnValue(chartMock);

      component.ngOnInit();

      const readySpy = jest.fn();
      component.ready.subscribe((event: ChartReadyEvent) => readySpy(event));

      const readyCallback = visualizationMock.events.addListener.mock.calls[0][2];
      readyCallback();

      expect(readySpy).toHaveBeenCalledWith({ chart: chartMock });
    });

    it('should emit error event if the chart caused an error', () => {
      component.ngOnInit();

      const errorSpy = jest.fn();
      component.error.subscribe((event: ChartErrorEvent) => errorSpy(event));

      const errorCallback = visualizationMock.events.addListener.mock.calls[1][2];

      const error = 'someerror';
      errorCallback(error);

      expect(errorSpy).toHaveBeenCalledWith(error);
    });

    it('should emit select event if a value was selected', () => {
      const selection = [{ column: 1, row: 2 }] as google.visualization.VisualizationSelectionArray[];

      const chartMock = { getSelection: jest.fn(() => selection) };
      chartWrapperMock.getChart.mockReturnValue(chartMock);

      const selectSpy = jest.fn();
      component.select.subscribe((event: ChartSelectionChangedEvent) => selectSpy(event));

      component.ngOnInit();

      expect(selectSpy).not.toHaveBeenCalled();

      const selectCallback = visualizationMock.events.addListener.mock.calls[2][2];

      selectCallback();

      expect(selectSpy).toHaveBeenCalledWith({ selection });
    });
  });

  function changeSpecs(newValue?: google.visualization.ChartSpecs) {
    const oldValue = component.specs;
    component.specs = newValue;
    component.ngOnChanges({ specs: new SimpleChange(oldValue, newValue, oldValue == null) });
  }
});
