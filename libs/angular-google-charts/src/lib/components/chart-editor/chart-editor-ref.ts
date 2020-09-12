/// <reference path="./types.ts" />

import { Observable, Subject } from 'rxjs';

export type EditChartResult = google.visualization.ChartWrapper | null;

export class ChartEditorRef {
  private readonly doneSubject = new Subject<EditChartResult>();

  constructor(private readonly editor: google.visualization.ChartEditor) {
    this.addEventListeners();
  }

  /**
   * Gets an observable that is notified when the dialog is saved.
   * Emits either the result if the dialog was saved or `null` if editing was cancelled.
   */
  public afterClosed(): Observable<EditChartResult> {
    return this.doneSubject.asObservable();
  }

  /**
   * Stops editing the chart and closes the dialog.
   */
  public cancel() {
    this.editor.closeDialog();
  }

  private addEventListeners() {
    google.visualization.events.addOneTimeListener(this.editor, 'ok', () => {
      google.visualization.events.removeAllListeners(this.editor);

      const updatedChartWrapper = this.editor.getChartWrapper();

      this.doneSubject.next(updatedChartWrapper);
      this.doneSubject.complete();
    });

    google.visualization.events.addOneTimeListener(this.editor, 'cancel', () => {
      google.visualization.events.removeAllListeners(this.editor);

      this.doneSubject.next(null);
      this.doneSubject.complete();
    });
  }
}
