/// <reference path="./types.ts" />

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { ScriptLoaderService } from '../../services/script-loader.service';
import { ChartBase } from '../chart-base/chart-base.component';

import { ChartEditorRef } from './chart-editor-ref';

@Component({
  selector: 'chart-editor',
  template: `<ng-content></ng-content>`,
  host: { class: 'chart-editor' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartEditorComponent implements OnInit {
  private editor: google.visualization.ChartEditor | undefined;
  private initializedSubject = new Subject<google.visualization.ChartEditor>();

  constructor(private scriptLoaderService: ScriptLoaderService) {}

  /**
   * Emits as soon as the chart editor is fully initialized.
   */
  public get initialized$() {
    return this.initializedSubject.asObservable();
  }

  public ngOnInit() {
    this.scriptLoaderService.loadChartPackages('charteditor').subscribe(() => {
      this.editor = new google.visualization.ChartEditor();
      this.initializedSubject.next(this.editor);
      this.initializedSubject.complete();
    });
  }

  /**
   * Opens the chart editor as an embedded dialog box on the page.
   * If the editor gets saved, the components' chart will be updated with the result.
   *
   * @param component The chart to be edited.
   * @returns A reference to the open editor.
   */
  public editChart(component: ChartBase): ChartEditorRef;
  public editChart(component: ChartBase, options: google.visualization.ChartEditorOptions): ChartEditorRef;
  public editChart(component: ChartBase, options?: google.visualization.ChartEditorOptions) {
    if (!component.chartWrapper) {
      throw new Error(
        'Chart wrapper is `undefined`. Please wait for the `initialized$` observable before trying to edit a chart.'
      );
    }
    if (!this.editor) {
      throw new Error(
        'Chart editor is `undefined`. Please wait for the `initialized$` observable before trying to edit a chart.'
      );
    }

    const handle = new ChartEditorRef(this.editor);
    this.editor.openDialog(component.chartWrapper, options || {});

    handle.afterClosed().subscribe(result => {
      if (result) {
        component.chartWrapper = result;
      }
    });

    return handle;
  }
}
