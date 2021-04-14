import { SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';

import { ScriptLoaderService } from '../../services/script-loader.service';
import { ChartType } from '../../types/chart-type';
import { ChartReadyEvent } from '../../types/events';

import { GoogleChartComponent } from './google-chart.component';

jest.mock('../../services/script-loader.service');

const chartWrapperMock = {
  setChartType: jest.fn(),
  setDataTable: jest.fn(),
  setOptions: jest.fn(),
  draw: jest.fn(),
  getChart: jest.fn()
};

const visualizationMock = {
  ChartWrapper: jest.fn(),
  arrayToDataTable: jest.fn(),
  events: {
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn()
  }
};

describe('GoogleChartComponent', () => {
  let component: GoogleChartComponent;
  let fixture: ComponentFixture<GoogleChartComponent>;

  beforeEach(() => {
    visualizationMock.ChartWrapper.mockReturnValue(chartWrapperMock);
    globalThis.google = { visualization: visualizationMock } as any;
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoogleChartComponent],
      providers: [ScriptLoaderService]
    }).compileComponents();
  });

  beforeEach(() => {
    const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
    scriptLoaderService.loadChartPackages.mockReturnValue(EMPTY);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleChartComponent);
    component = fixture.componentInstance;
    // No change detection here, we want to invoke the
    // lifecycle methods in the unit tests
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should not throw when trying to access chart if its not yet drawn', () => {
    component['wrapper'] = chartWrapperMock as any;
    expect(() => component.chart).not.toThrow();
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

  describe('ngOnInit', () => {
    it('should load the google chart library', () => {
      const service = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      service.loadChartPackages.mockReturnValueOnce(EMPTY);

      component.ngOnInit();

      expect(service.loadChartPackages).toHaveBeenCalled();
    });

    it(
      'should not throw if only the type, but no data is provided',
      waitForAsync(() => {
        const service = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
        service.loadChartPackages.mockReturnValueOnce(of(null));

        component.ngOnInit();

        expect(component['wrapper']).toBeDefined();
        expect(chartWrapperMock.draw).toHaveBeenCalledTimes(1);
      })
    );

    it('should create the data table', () => {
      const service = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      service.loadChartPackages.mockReturnValueOnce(of(null));

      const data = [
        ['First Row', 10],
        ['Second Row', 11]
      ];
      component.data = data;

      const columns = ['Some data', 'Some values'];
      component.columns = columns;

      component.ngOnInit();

      expect(visualizationMock.arrayToDataTable).toHaveBeenCalledWith([columns, ...data], false);
    });

    it('should assume the first row is data if no columns are provided', () => {
      const service = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      service.loadChartPackages.mockReturnValueOnce(of(null));

      const data = [
        ['First Row', 10],
        ['Second Row', 11]
      ];
      component.data = data;

      component.ngOnInit();

      expect(visualizationMock.arrayToDataTable).toHaveBeenCalledWith(data, true);
    });

    it('should create the chart', () => {
      const service = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      service.loadChartPackages.mockReturnValueOnce(of(null));

      const dataTableMock = { data: [] };
      visualizationMock.arrayToDataTable.mockReturnValueOnce(dataTableMock);

      const data = [
        ['First Row', 10],
        ['Second Row', 11]
      ];
      component.data = data;

      const columns = ['Some data', 'Some values'];
      component.columns = columns;

      const options = { test: 'test' };
      component.options = options;

      const chartType = ChartType.BarChart;
      component.type = chartType;

      component.ngOnInit();

      expect(visualizationMock.ChartWrapper).toHaveBeenCalledWith({
        container: expect.any(Object),
        dataTable: dataTableMock,
        chartType,
        options
      });
    });

    it('should set the title, width and height', () => {
      const service = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      service.loadChartPackages.mockReturnValueOnce(of(null));

      const dataTableMock = { data: [] };
      visualizationMock.arrayToDataTable.mockReturnValueOnce(dataTableMock);

      const data = [
        ['First Row', 10],
        ['Second Row', 11]
      ];
      component.data = data;

      const columns = ['Some data', 'Some values'];
      component.columns = columns;

      const options = { test: 'test' };
      component.options = options;

      const title = 'chart';
      component.title = title;

      const width = 120;
      component.width = width;

      const height = 150;
      component.height = height;

      const chartType = ChartType.BarChart;
      component.type = chartType;

      component.ngOnInit();

      expect(visualizationMock.ChartWrapper).toHaveBeenCalledWith({
        container: expect.any(Object),
        dataTable: dataTableMock,
        options: { ...options, width, height, title },
        chartType
      });
    });

    it('should apply the provided formatters', () => {
      const service = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      service.loadChartPackages.mockReturnValueOnce(of(null));

      const formatter = { formatter: { format: jest.fn() }, colIndex: 1 };
      component.formatters = [formatter];
      component.data = [];

      const dataTableMock = {};
      visualizationMock.arrayToDataTable.mockReturnValueOnce(dataTableMock);

      component.ngOnInit();

      expect(formatter.formatter.format).toHaveBeenCalledWith(dataTableMock, formatter.colIndex);
    });

    it('should draw the chart', () => {
      const service = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      service.loadChartPackages.mockReturnValueOnce(of(null));

      component.ngOnInit();

      expect(chartWrapperMock.draw).toHaveBeenCalled();
    });

    it('should not draw the chart if the chart is part of a dashboard', () => {
      const service = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      service.loadChartPackages.mockReturnValueOnce(of(null));

      component['dashboard'] = {} as any;

      component.ngOnInit();

      expect(chartWrapperMock.draw).not.toHaveBeenCalled();
    });

    it('should emit wrapper ready event', () => {
      const service = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      service.loadChartPackages.mockReturnValueOnce(of(null));

      const readySpy = jest.fn();
      component.wrapperReady$.subscribe(event => readySpy(event));

      component.ngOnInit();

      expect(readySpy).toHaveBeenCalledWith(chartWrapperMock);
    });

    it('should register chart wrapper event handlers', () => {
      const service = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      service.loadChartPackages.mockReturnValueOnce(of(null));

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
    });

    it('should create the chart with correct package', () => {
      const service = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      service.loadChartPackages.mockReturnValueOnce(of(null));

      const chartType = ChartType.Map;
      component.type = chartType;

      component.ngOnInit();

      expect(service.loadChartPackages).toHaveBeenCalledWith('map');
    });
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      component['wrapper'] = chartWrapperMock as any;
      component['initialized'] = true;
    });

    it('should not throw if anything changed but the chart wrapper was not yet initialized', () => {
      component['wrapper'] = undefined;
      component['initialized'] = false;

      expect(() => {
        component.ngOnChanges({
          data: new SimpleChange(null, [], true),
          columns: new SimpleChange(null, [], true)
        });
      }).not.toThrow();
    });

    it('should draw the chart only once if `type`, `data` and `columns` changed all at once', () => {
      const data = [
        ['First Row', 10],
        ['Second Row', 11]
      ];
      component.data = data;

      const columns = ['Some data', 'Some values'];
      component.columns = columns;

      const chartType = ChartType.BarChart;
      component.type = chartType;
      component.ngOnChanges({
        type: new SimpleChange(null, chartType, true),
        data: new SimpleChange(null, data, true),
        columns: new SimpleChange(null, columns, true)
      });

      expect(chartWrapperMock.draw).toHaveBeenCalledTimes(1);
    });

    it('should not redraw the chart if nothing changed', () => {
      component.ngOnChanges({});

      expect(chartWrapperMock.draw).not.toBeCalled();
    });

    it('should redraw the chart if `data` changed', () => {
      const data = [
        ['First Row', 10],
        ['Second Row', 11]
      ];
      component.data = data;

      const columns = ['Some label', 'Some values'];
      component.columns = columns;

      const dataTableMock = {};
      visualizationMock.arrayToDataTable.mockReturnValueOnce(dataTableMock);

      const newData = [...data, ['Third Row', 12]];
      changeInput('data', newData);

      expect(visualizationMock.arrayToDataTable).toHaveBeenCalledWith([columns, ...newData], false);
      expect(chartWrapperMock.setDataTable).toHaveBeenCalledWith(dataTableMock);
      expect(chartWrapperMock.draw).toHaveBeenCalled();
    });

    it('should redraw the chart if `columns` changed', () => {
      const data = [
        ['First Row', 10],
        ['Second Row', 11]
      ];
      component.data = data;

      const columns = ['Some label', 'Some values'];
      component.columns = columns;

      const dataTableMock = {};
      visualizationMock.arrayToDataTable.mockReturnValueOnce(dataTableMock);

      const newColumns = ['New label', 'Some values'];
      changeInput('columns', newColumns);

      expect(visualizationMock.arrayToDataTable).toHaveBeenCalledWith([newColumns, ...data], false);
      expect(chartWrapperMock.setDataTable).toHaveBeenCalledWith(dataTableMock);
      expect(chartWrapperMock.draw).toHaveBeenCalled();
    });

    it('should redraw the chart if `formatters` changed', () => {
      const data = [
        ['First Row', 10],
        ['Second Row', 11]
      ];
      component.data = data;

      const columns = ['Some label', 'Some values'];
      component.columns = columns;

      const dataTableMock = {};
      visualizationMock.arrayToDataTable.mockReturnValueOnce(dataTableMock);

      const formatter = { formatter: { format: jest.fn() }, colIndex: 1 };
      changeInput('formatters', [formatter]);

      expect(formatter.formatter.format).toHaveBeenCalled();
      expect(chartWrapperMock.setDataTable).toHaveBeenCalledWith(dataTableMock);
      expect(chartWrapperMock.draw).toHaveBeenCalled();
    });

    it('should redraw the chart if `options` changed', () => {
      const options = { test: 'test' };
      changeInput('options', options);

      expect(chartWrapperMock.setOptions).toHaveBeenCalledWith(options);
      expect(chartWrapperMock.draw).toHaveBeenCalled();
    });

    it('should redraw the chart if `title` changed', () => {
      const title = 'some title';
      changeInput('title', title);

      expect(chartWrapperMock.setOptions).toHaveBeenCalledWith({ title });
      expect(chartWrapperMock.draw).toHaveBeenCalled();
    });

    it('should redraw the chart if `width` changed', () => {
      const width = 100;
      changeInput('width', width);

      expect(chartWrapperMock.setOptions).toHaveBeenCalledWith({ width });
      expect(chartWrapperMock.draw).toHaveBeenCalled();
    });

    it('should redraw the chart if `height` changed', () => {
      const height = 100;
      changeInput('height', height);

      expect(chartWrapperMock.setOptions).toHaveBeenCalledWith({ height });
      expect(chartWrapperMock.draw).toHaveBeenCalled();
    });
  });

  describe('dynamicResize', () => {
    it('should subscribe to window resize event if set to true', () => {
      changeInput('dynamicResize', true);

      expect(component['resizeSubscription']).toBeTruthy();
    });

    it('should unsubscribe existing subscription if changed', () => {
      const subscriptionMock = { unsubscribe: jest.fn() };
      component['resizeSubscription'] = subscriptionMock as any;

      changeInput('dynamicResize', false);

      expect(subscriptionMock.unsubscribe).toHaveBeenCalled();
      expect(component['resizeSubscription']).toBeUndefined();
    });

    it('should do nothing if the window was resized, but the chart is not yet initialized', fakeAsync(() => {
      changeInput('dynamicResize', true);

      expect(() => {
        // This would cause an error if the wrapper would somehow be called
        window.dispatchEvent(new Event('resize'));
        tick(100);
      }).not.toThrow();
    }));

    it('should redraw the chart if the window was resized', fakeAsync(() => {
      const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      scriptLoaderService.loadChartPackages.mockReturnValue(of(null));

      component.ngOnInit();

      changeInput('dynamicResize', true);

      window.dispatchEvent(new Event('resize'));
      tick(100);

      expect(chartWrapperMock.draw).toHaveBeenCalled();
    }));
  });

  describe('events', () => {
    beforeEach(() => {
      const service = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      service.loadChartPackages.mockReturnValueOnce(of(null));
    });

    it('should register chart event handlers after the chart got drawn', () => {
      const chartMock = { draw: jest.fn() };
      chartWrapperMock.getChart.mockReturnValue(chartMock);

      component.ngOnInit();

      expect(visualizationMock.events.addListener).not.toHaveBeenCalledWith(
        chartWrapperMock,
        'onmouseover',
        expect.any(Function)
      );
      expect(visualizationMock.events.addListener).not.toHaveBeenCalledWith(
        chartWrapperMock,
        'onmouseout',
        expect.any(Function)
      );
      expect(visualizationMock.events.addListener).not.toHaveBeenCalledWith(
        chartWrapperMock,
        'select',
        expect.any(Function)
      );

      const readyCallback = visualizationMock.events.addListener.mock.calls[0][2];
      readyCallback();

      expect(visualizationMock.events.addListener).toHaveBeenCalledWith(chartMock, 'onmouseover', expect.any(Function));
      expect(visualizationMock.events.addListener).toHaveBeenCalledWith(chartMock, 'onmouseout', expect.any(Function));
      expect(visualizationMock.events.addListener).toHaveBeenCalledWith(chartMock, 'select', expect.any(Function));
    });

    it('should remove all listeners from the chart before subscribing again', () => {
      const chartMock = { draw: jest.fn() };
      chartWrapperMock.getChart.mockReturnValue(chartMock);

      component.ngOnInit();

      expect(visualizationMock.events.removeAllListeners).toHaveBeenCalledWith(chartWrapperMock);

      const readyCallback = visualizationMock.events.addListener.mock.calls[0][2];
      readyCallback();

      expect(visualizationMock.events.removeAllListeners).toHaveBeenCalledWith(chartMock);
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
      component.error.subscribe((event: ChartReadyEvent) => errorSpy(event));

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
      component.select.subscribe((event: ChartReadyEvent) => selectSpy(event));

      component.ngOnInit();

      const readyCallback = visualizationMock.events.addListener.mock.calls[0][2];
      readyCallback();

      expect(selectSpy).not.toHaveBeenCalled();

      const selectCallback = visualizationMock.events.addListener.mock.calls[4][2];
      selectCallback();

      expect(selectSpy).toHaveBeenCalledWith({ selection });
    });

    it('should add and remove custom event listeners', () => {
      const chartMock = { draw: jest.fn() };
      chartWrapperMock.getChart.mockReturnValue(chartMock);

      component.ngOnInit();

      visualizationMock.events.addListener.mockReturnValue('handle1');
      const rollupCallback = () => {};
      let handle = component.addEventListener('rollup', rollupCallback);
      expect(handle).toBe('handle1');
      expect(visualizationMock.events.addListener).lastCalledWith(chartMock, 'rollup', rollupCallback);

      component.removeEventListener(handle);
      expect(visualizationMock.events.removeListener).lastCalledWith(handle);

      handle = component.addEventListener('rollup', rollupCallback);
      visualizationMock.events.addListener.mockReturnValue('handle2');
      const readyCallback = visualizationMock.events.addListener.mock.calls[0][2];
      readyCallback();

      component.removeEventListener(handle);
      expect(visualizationMock.events.removeListener).not.lastCalledWith(handle);
      expect(visualizationMock.events.removeListener).lastCalledWith('handle2');
    });
  });

  function changeInput<K extends keyof GoogleChartComponent>(property: K, newValue: GoogleChartComponent[K]) {
    const oldValue = component[property];
    component[property] = newValue;
    component.ngOnChanges({ [property]: new SimpleChange(oldValue, newValue, oldValue == null) });
  }
});
