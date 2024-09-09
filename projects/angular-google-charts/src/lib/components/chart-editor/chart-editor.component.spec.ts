import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';

import { ScriptLoaderService } from '../../services/script-loader.service';
import { ChartBase } from '../chart-base/chart-base.component';

import { ChartEditorRef } from './chart-editor-ref';
import { ChartEditorComponent } from './chart-editor.component';

jest.mock('../../services/script-loader.service');
jest.mock('./chart-editor-ref');

const editorRefMock = {
  afterClosed: jest.fn()
};

const visualizationMock = {
  ChartEditor: jest.fn()
};

const editorMock = {
  openDialog: jest.fn(),
  closeDialog: jest.fn(),
  setChartWrapper: jest.fn(),
  getChartWrapper: jest.fn()
} as jest.Mocked<google.visualization.ChartEditor>;

describe('ChartEditorComponent', () => {
  let component: ChartEditorComponent;
  let fixture: ComponentFixture<ChartEditorComponent>;

  beforeEach(() => {
    visualizationMock.ChartEditor.mockReturnValue(editorMock);
    globalThis.google = { visualization: visualizationMock } as any;
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartEditorComponent],
      providers: [ScriptLoaderService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartEditorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load editor package', () => {
      const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      scriptLoaderService.loadChartPackages.mockReturnValueOnce(EMPTY);

      component.ngOnInit();

      expect(scriptLoaderService.loadChartPackages).toHaveBeenCalledWith('charteditor');
    });

    it('should create chart editor', () => {
      const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      scriptLoaderService.loadChartPackages.mockReturnValueOnce(of(null));

      component.ngOnInit();

      expect(visualizationMock.ChartEditor).toHaveBeenCalled();
    });

    it('should emit initialized event', () => {
      const scriptLoaderService = TestBed.inject(ScriptLoaderService) as jest.Mocked<ScriptLoaderService>;
      scriptLoaderService.loadChartPackages.mockReturnValueOnce(of(null));

      const initializedSpy = jest.fn();
      component.initialized$.subscribe(event => initializedSpy(event));

      component.ngOnInit();

      expect(initializedSpy).toHaveBeenCalledWith(editorMock);
    });
  });

  describe('editChart', () => {
    const chartWrapper = { draw: jest.fn() } as any;

    beforeEach(() => {
      component['editor'] = editorMock;
      (ChartEditorRef as any as jest.SpyInstance).mockReturnValue(editorRefMock);
      editorRefMock.afterClosed.mockReturnValue(EMPTY);
    });

    it('should open the edit dialog', () => {
      const chartComponent = { chartWrapper } as ChartBase;

      component.editChart(chartComponent);

      expect(editorMock.openDialog).toHaveBeenCalledWith(chartComponent.chartWrapper, {});
    });

    it('should pass the provided options', () => {
      const chartComponent = { chartWrapper } as ChartBase;

      const options = {
        dataSourceInput: 'urlbox'
      } as google.visualization.ChartEditorOptions;

      component.editChart(chartComponent, options);

      expect(editorMock.openDialog).toHaveBeenCalledWith(chartComponent.chartWrapper, options);
    });

    it('should create an editor ref and return it', () => {
      const chartComponent = { chartWrapper } as ChartBase;
      const handle = component.editChart(chartComponent);

      expect(ChartEditorRef).toHaveBeenCalledWith(editorMock);
      expect(handle).toBe(editorRefMock);
    });

    it('should update the components chart wrapper with the edit result', async () => {
      const chartComponent = { chartWrapper } as ChartBase;
      const updatedWrapper = { draw: jest.fn() };

      editorRefMock.afterClosed.mockReturnValue(of(updatedWrapper));

      component.editChart(chartComponent);

      expect(chartComponent.chartWrapper).toBe(updatedWrapper);
    });

    it('should not update the components wrapper if editing was cancelled', () => {
      const chartComponent = { chartWrapper } as ChartBase;

      editorRefMock.afterClosed.mockReturnValue(of(null));

      component.editChart(chartComponent);

      expect(chartComponent.chartWrapper).toBe(chartWrapper);
    });

    it("should throw if the component' chart wrapper is undefined", () => {
      const chartComponent = {} as ChartBase;
      expect(() => component.editChart(chartComponent)).toThrow();
    });

    it("should throw if the component' editor is undefined", () => {
      const chartComponent = { chartWrapper } as ChartBase;

      component['editor'] = undefined;

      expect(() => component.editChart(chartComponent)).toThrow();
    });
  });
});
