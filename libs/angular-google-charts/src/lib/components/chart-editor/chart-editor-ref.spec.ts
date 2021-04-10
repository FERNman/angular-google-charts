import { ChartEditorRef } from './chart-editor-ref';

const visualizationMock = {
  events: {
    addOneTimeListener: jest.fn(),
    removeAllListeners: jest.fn()
  }
};

const editorMock = {
  openDialog: jest.fn(),
  closeDialog: jest.fn(),
  setChartWrapper: jest.fn(),
  getChartWrapper: jest.fn()
} as jest.Mocked<google.visualization.ChartEditor>;

describe('ChartEditorRef', () => {
  let editor: ChartEditorRef;

  beforeEach(() => {
    globalThis.google = { visualization: visualizationMock } as any;
    editor = new ChartEditorRef(editorMock);
  });

  it('should create', () => {
    expect(editor).toBeTruthy();
  });

  it('should register event listeners on create', () => {
    expect(visualizationMock.events.addOneTimeListener).toHaveBeenCalledWith(editorMock, 'ok', expect.any(Function));
    expect(visualizationMock.events.addOneTimeListener).toHaveBeenCalledWith(
      editorMock,
      'cancel',
      expect.any(Function)
    );
  });

  describe('afterClosed', () => {
    it('should emit update wrapper if dialog was saved', () => {
      const okCallback = visualizationMock.events.addOneTimeListener.mock.calls[0][2];

      const editResult = { draw: jest.fn() };
      editorMock.getChartWrapper.mockReturnValueOnce(editResult as any);

      const closedSpy = jest.fn();
      editor.afterClosed().subscribe(result => closedSpy(result));

      okCallback();

      expect(google.visualization.events.removeAllListeners).toHaveBeenCalled();
      expect(closedSpy).toHaveBeenCalledWith(editResult);
    });

    it('should emit `null` if dialog was cancelled', () => {
      const cancelCallback = visualizationMock.events.addOneTimeListener.mock.calls[1][2];

      const closedSpy = jest.fn();
      editor.afterClosed().subscribe(result => closedSpy(result));

      cancelCallback();

      expect(google.visualization.events.removeAllListeners).toHaveBeenCalled();
      expect(closedSpy).toHaveBeenCalledWith(null);
    });
  });

  describe('cancel', () => {
    it('should close the dialog', () => {
      editor.cancel();

      expect(editorMock.closeDialog).toHaveBeenCalled();
    });
  });
});
