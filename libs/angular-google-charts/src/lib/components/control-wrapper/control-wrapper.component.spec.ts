import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';

import { ScriptLoaderService } from '../../services/script-loader.service';
import { FilterType } from '../../types/control-type';
import { ChartErrorEvent, ChartReadyEvent } from '../../types/events';

import { ControlWrapperComponent } from './control-wrapper.component';

jest.mock('../../services/script-loader.service');

const visualizationMock = {
  ControlWrapper: jest.fn(),
  events: {
    addListener: jest.fn(),
    removeAllListeners: jest.fn()
  }
};

describe('ControlWrapperComponent', () => {
  let component: ControlWrapperComponent;
  let fixture: ComponentFixture<ControlWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ControlWrapperComponent],
      providers: [ScriptLoaderService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlWrapperComponent);
    component = fixture.componentInstance;
    // No change detection here, we want to invoke the
    // lifecycle methods in the unit tests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load the `controls` package', () => {
      const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      scriptLoaderService.loadChartPackages.mockReturnValueOnce(EMPTY);

      component.ngOnInit();

      expect(scriptLoaderService.loadChartPackages).toHaveBeenCalledWith('controls');
    });

    it('should create the control wrapper after the packages loaded', () => {
      const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      scriptLoaderService.loadChartPackages.mockReturnValueOnce(of(null));

      globalThis.google = { visualization: visualizationMock } as any;

      const options = {
        containerId: 'someid',
        controlType: FilterType.ChartRange,
        state: { test: 1 },
        options: { key: 'value' }
      };

      // @ts-ignore
      component.id = options.containerId;
      component.type = options.controlType;
      component.state = options.state;
      component.options = options.options;

      component.ngOnInit();

      expect(visualizationMock.ControlWrapper).toHaveBeenCalledWith(options);
      expect(component.controlWrapper).toBeTruthy();
    });

    it('should add event listeners', () => {
      const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      scriptLoaderService.loadChartPackages.mockReturnValueOnce(of(null));

      const controlWrapperMock = { setControlType: jest.fn() };
      visualizationMock.ControlWrapper.mockReturnValue(controlWrapperMock);

      globalThis.google = { visualization: visualizationMock } as any;

      component.ngOnInit();

      expect(visualizationMock.events.removeAllListeners).toHaveBeenCalledWith(controlWrapperMock);
      expect(visualizationMock.events.addListener).toHaveBeenCalledWith(
        controlWrapperMock,
        'ready',
        expect.any(Function)
      );
      expect(visualizationMock.events.addListener).toHaveBeenCalledWith(
        controlWrapperMock,
        'error',
        expect.any(Function)
      );
      expect(visualizationMock.events.addListener).toHaveBeenCalledWith(
        controlWrapperMock,
        'statechange',
        expect.any(Function)
      );
    });

    it('should emit wrapper ready event', () => {
      const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      scriptLoaderService.loadChartPackages.mockReturnValueOnce(of(null));

      const controlWrapperMock = { setControlType: jest.fn() };
      visualizationMock.ControlWrapper.mockReturnValue(controlWrapperMock);

      globalThis.google = { visualization: visualizationMock } as any;

      const wrapperReadySpy = jest.fn();
      component.wrapperReady$.subscribe(event => wrapperReadySpy(event));

      component.ngOnInit();

      expect(wrapperReadySpy).toHaveBeenCalledTimes(1);
      expect(wrapperReadySpy).toHaveBeenCalledWith(controlWrapperMock);
    });
  });

  describe('ngOnChanges', () => {
    function changeInput<K extends keyof ControlWrapperComponent>(property: K, newValue: ControlWrapperComponent[K]) {
      const oldValue = component[property];
      component[property] = newValue;
      component.ngOnChanges({ [property]: new SimpleChange(oldValue, newValue, oldValue == null) });
    }

    it('should not throw if component is not yet initialized', () => {
      expect(() => component.ngOnChanges({ type: new SimpleChange(null, null, true) })).not.toThrow();
    });

    it('should update the control type if it changed', () => {
      const controlWrapperMock = { setControlType: jest.fn() };
      component['_controlWrapper'] = controlWrapperMock as any;

      const type = FilterType.Category;
      changeInput('type', type);

      expect(controlWrapperMock.setControlType).toHaveBeenCalledWith(type);
    });

    it('should update the options if they changed', () => {
      const controlWrapperMock = { setOptions: jest.fn() };
      component['_controlWrapper'] = controlWrapperMock as any;

      const options = { key: 'value' };
      changeInput('options', options);

      expect(controlWrapperMock.setOptions).toHaveBeenCalledWith(options);
    });

    it('should update the state if it changed', () => {
      const controlWrapperMock = { setState: jest.fn() };
      component['_controlWrapper'] = controlWrapperMock as any;

      const state = { from: 'to' };
      changeInput('state', state);

      expect(controlWrapperMock.setState).toHaveBeenCalledWith(state);
    });
  });

  describe('events', () => {
    beforeEach(() => {
      const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      scriptLoaderService.loadChartPackages.mockReturnValueOnce(of(null));

      const controlWrapperMock = { setControlType: jest.fn() };
      visualizationMock.ControlWrapper.mockReturnValue(controlWrapperMock);

      globalThis.google = { visualization: visualizationMock } as any;
    });

    it('should emit ready event', () => {
      const readySpy = jest.fn();
      component.ready.subscribe((event: ChartReadyEvent) => readySpy(event));

      // This leads to the component subscribing to all events
      component.ngOnInit();

      const readyCallback: Function = visualizationMock.events.addListener.mock.calls[0][2];

      const eventMock = 'event';
      readyCallback(eventMock);

      expect(readySpy).toHaveBeenCalledWith(eventMock);
    });

    it('should emit error event', () => {
      const errorSpy = jest.fn();
      component.error.subscribe((event: ChartErrorEvent) => errorSpy(event));

      // This leads to the component subscribing to all events
      component.ngOnInit();

      const errorCallback: Function = visualizationMock.events.addListener.mock.calls[1][2];

      const eventMock = 'event';
      errorCallback(eventMock);

      expect(errorSpy).toHaveBeenCalledWith(eventMock);
    });

    it('should emit statechange event', () => {
      const stateChangeSpy = jest.fn();
      component.stateChange.subscribe((event: unknown) => stateChangeSpy(event));

      // This leads to the component subscribing to all events
      component.ngOnInit();

      const stateChangeCallback: Function = visualizationMock.events.addListener.mock.calls[2][2];

      const eventMock = 'event';
      stateChangeCallback(eventMock);

      expect(stateChangeSpy).toHaveBeenCalledWith(eventMock);
    });
  });
});
