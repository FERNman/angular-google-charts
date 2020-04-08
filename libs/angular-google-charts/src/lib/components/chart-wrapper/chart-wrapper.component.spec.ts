import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';

import { ChartType } from '../../models/chart-type.model';
import { ScriptLoaderService } from '../../script-loader/script-loader.service';

import { ChartWrapperComponent } from './chart-wrapper.component';

jest.mock('../../script-loader/script-loader.service');

const chartWrapperMock = {
  draw: jest.fn(),
  getChart: jest.fn()
};

const visualizationMock = {
  ChartWrapper: jest.fn(),
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
    fixture = TestBed.createComponent(ChartWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load the required package for the chart', () => {
    const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
    scriptLoaderService.loadChartPackages.mockReturnValue(EMPTY);

    const specs = { chartType: ChartType.AreaChart };
    changeSpecs(specs);

    expect(scriptLoaderService.loadChartPackages).toHaveBeenCalledWith('corechart');
  });

  it('should draw a chart using the provided specs', () => {
    const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
    scriptLoaderService.loadChartPackages.mockReturnValue(of(void 0));

    const specs = { chartType: ChartType.AreaChart, dataTable: [] };
    changeSpecs(specs);

    expect(visualizationMock.ChartWrapper).toHaveBeenCalledWith(specs);
    expect(chartWrapperMock.draw).toHaveBeenCalled();
  });

  it('should redraw the chart if the specs change', () => {
    const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
    scriptLoaderService.loadChartPackages.mockReturnValue(of(void 0));

    const specs = { chartType: ChartType.AreaChart, dataTable: [] } as google.visualization.ChartSpecs;
    changeSpecs(specs);

    const newSpecs = { ...specs, chartType: ChartType.GeoChart };
    changeSpecs(newSpecs);

    expect(chartWrapperMock.draw).toHaveBeenCalledTimes(2);
  });

  it("should not redraw the chart if the specs didn't change", () => {
    const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
    scriptLoaderService.loadChartPackages.mockReturnValue(of(void 0));

    const specs = { chartType: ChartType.AreaChart, dataTable: [] } as google.visualization.ChartSpecs;
    changeSpecs(specs);

    component.ngOnChanges({});

    expect(chartWrapperMock.draw).toHaveBeenCalledTimes(1);
  });

  it('should overwrite `container` and `containerId` if given', () => {
    const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
    scriptLoaderService.loadChartPackages.mockReturnValue(of(void 0));

    const specs = { chartType: ChartType.AreaChart, containerId: 'test', container: {} } as google.visualization.ChartSpecs;
    changeSpecs(specs);

    expect(visualizationMock.ChartWrapper).toHaveBeenCalledWith({ chartType: specs.chartType });
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
      const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      scriptLoaderService.loadChartPackages.mockReturnValue(of(void 0));

      const specs = { chartType: ChartType.AreaChart, dataTable: [] } as google.visualization.ChartSpecs;
      changeSpecs(specs);

      const wrapper = component.chartWrapper;
      expect(wrapper).toBe(chartWrapperMock);
    });
  });

  describe('events', () => {
    const specs = { chartType: ChartType.AreaChart } as google.visualization.ChartSpecs;

    beforeEach(() => {
      const service = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      service.loadChartPackages.mockReturnValueOnce(of(void 0));
    });

    it('should remove all event handlers before redrawing the chart', () => {
      changeSpecs(specs);

      expect(visualizationMock.events.removeAllListeners).toHaveBeenCalled();
    });

    it('should register chart wrapper event handlers', () => {
      changeSpecs(specs);

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

      changeSpecs(specs);

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
