import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ChartType } from '../../models/chart-type.model';
import { ScriptLoaderService } from '../../script-loader/script-loader.service';

import { ChartWrapperComponent } from './chart-wrapper.component';

jest.mock('../../script-loader/script-loader.service');

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChartWrapperComponent],
      providers: [ScriptLoaderService]
    }).compileComponents();
  }));

  beforeEach(() => {
    const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
    scriptLoaderService.loadChartPackages.mockReturnValue(of(null));
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

  it('should load google charts', () => {
    component.ngOnInit();

    const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
    expect(scriptLoaderService.loadChartPackages).toHaveBeenCalled();
  });

  it('should draw a chart using the provided specs', () => {
    const specs = { chartType: ChartType.AreaChart, dataTable: [] };
    component.specs = specs;
    component.ngOnInit();

    expect(visualizationMock.ChartWrapper).toHaveBeenCalled();
    expect(chartWrapperMock.setChartType).toBeCalledWith(specs.chartType);
    expect(chartWrapperMock.setDataTable).toHaveBeenCalledWith(specs.dataTable);
    expect(chartWrapperMock.draw).toHaveBeenCalled();
  });

  it('should redraw the chart if the specs change', () => {
    const specs = { chartType: ChartType.AreaChart, dataTable: [] } as google.visualization.ChartSpecs;
    component.specs = specs;
    component.ngOnInit();

    const newSpecs = { ...specs, chartType: ChartType.GeoChart };
    changeSpecs(newSpecs);

    expect(chartWrapperMock.draw).toHaveBeenCalledTimes(2);
  });

  it("should not redraw the chart if the specs didn't change", () => {
    const specs = { chartType: ChartType.AreaChart, dataTable: [] } as google.visualization.ChartSpecs;
    component.specs = specs;
    component.ngOnInit();

    component.ngOnChanges({});

    expect(chartWrapperMock.draw).toHaveBeenCalledTimes(1);
  });

  it('should ignore `container` and `containerId` if given', () => {
    const specs = { chartType: ChartType.AreaChart, containerId: 'test', container: {} } as google.visualization.ChartSpecs;
    component.specs = specs;
    component.ngOnInit();

    expect(chartWrapperMock.setContainerId).not.toBeCalled();
  });

  describe('chart', () => {
    it('should not throw when trying to access chart if its not yet drawn', () => {
      expect(() => component.chart).not.toThrow();
    });
  });

  describe('chartWrapper', () => {
    it('should not throw if the chart wrapper is `null`', () => {
      expect(() => component.chartWrapper).not.toThrow();
    });

    it('should return the chart wrapper', () => {
      const specs = { chartType: ChartType.AreaChart, dataTable: [] } as google.visualization.ChartSpecs;
      component.specs = specs;
      component.ngOnInit();

      const wrapper = component.chartWrapper;
      expect(wrapper).toBe(chartWrapperMock);
    });
  });

  describe('events', () => {
    const specs = { chartType: ChartType.AreaChart } as google.visualization.ChartSpecs;

    beforeEach(() => {
      component.specs = specs;
    });

    it('should remove all event handlers before redrawing the chart', () => {
      component.ngOnInit();

      expect(visualizationMock.events.removeAllListeners).toHaveBeenCalled();
    });

    it('should register chart wrapper event handlers', () => {
      component.ngOnInit();

      expect(visualizationMock.events.addListener).toHaveBeenCalledWith(chartWrapperMock, 'ready', expect.any(Function));
      expect(visualizationMock.events.addListener).toHaveBeenCalledWith(chartWrapperMock, 'error', expect.any(Function));
      expect(visualizationMock.events.addListener).toHaveBeenCalledWith(chartWrapperMock, 'select', expect.any(Function));
    });

    it.todo('should emit ready event after the chart is ready');

    it.todo('should emit error event if the chart caused an error');

    it('should emit select event if a value was selected', () => {
      let selectCallback: Function;

      visualizationMock.events.addListener.mockImplementation((_, name, callback) => {
        if (name === 'select') {
          selectCallback = callback;
        }
      });

      const selection = [{ column: 1, row: 2 }] as google.visualization.VisualizationSelectionArray[];

      const chartMock = { getSelection: jest.fn(() => selection) };
      chartWrapperMock.getChart.mockReturnValue(chartMock);

      const selectSpy = jest.fn();
      component.select.subscribe(event => selectSpy(event));
      component.ngOnInit();

      expect(selectSpy).not.toHaveBeenCalled();

      selectCallback();

      expect(selectSpy).toHaveBeenCalledWith({ selection });
    });
  });

  function changeSpecs(newValue: google.visualization.ChartSpecs) {
    const oldValue = component.specs;
    component.specs = newValue;
    component.ngOnChanges({ specs: new SimpleChange(oldValue, newValue, oldValue == null) });
  }
});
