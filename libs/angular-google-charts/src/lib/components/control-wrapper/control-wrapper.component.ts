import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { generateRandomId } from '../../helpers/id.helper';
import { ScriptLoaderService } from '../../services/script-loader.service';
import { FilterType } from '../../types/control-type';
import { ChartErrorEvent, ChartReadyEvent } from '../../types/events';
import { ChartBase } from '../chart-base/chart-base.component';

@Component({
  selector: 'control-wrapper',
  template: '',
  host: { class: 'control-wrapper' },
  exportAs: 'controlWrapper',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlWrapperComponent implements OnInit, OnChanges {
  /**
   * Charts controlled by this control wrapper. Can be a single chart or an array of charts.
   */
  @Input()
  public for!: ChartBase | ChartBase[];

  /**
   * The class name of the control.
   * The `google.visualization` package name can be omitted for Google controls.
   *
   * @example
   *
   * ```html
   * <control-wrapper type="CategoryFilter"></control-wrapper>
   * ```
   */
  @Input()
  public type!: FilterType;

  /**
   * An object describing the options for the control.
   * You can use either JavaScript literal notation, or provide a handle to the object.
   *
   * @example
   *
   * ```html
   * <control-wrapper [options]="{'filterColumnLabel': 'Age', 'minValue': 10, 'maxValue': 80}"></control-wrapper>
   * ```
   */
  @Input()
  public options?: object;

  /**
   * An object describing the state of the control.
   * The state collects all the variables that the user operating the control can affect.
   *
   * For example, a range slider state can be described in term of the positions that the low and high thumb
   * of the slider occupy.
   * You can use either Javascript literal notation, or provide a handle to the object.
   *
   * @example
   *
   *  ```html
   * <control-wrapper [state]="{'lowValue': 20, 'highValue': 50}"></control-wrapper>
   * ```
   */
  @Input()
  public state?: object;

  /**
   * Emits when an error occurs when attempting to render the control.
   */
  @Output()
  public error = new EventEmitter<ChartErrorEvent>();

  /**
   * The control is ready to accept user interaction and for external method calls.
   *
   * Alternatively, you can listen for a ready event on the dashboard holding the control
   * and call control methods only after the event was fired.
   */
  @Output()
  public ready = new EventEmitter<ChartReadyEvent>();

  /**
   * Emits when the user interacts with the control, affecting its state.
   * For example, a `stateChange` event will be emitted whenever you move the thumbs of a range slider control.
   *
   * To retrieve an updated control state after the event fired, call `ControlWrapper.getState()`.
   */
  @Output()
  public stateChange = new EventEmitter<unknown>();

  /**
   * A generated id assigned to this components DOM element.
   */
  @HostBinding('id')
  public readonly id = generateRandomId();

  private _controlWrapper?: google.visualization.ControlWrapper;
  private wrapperReadySubject = new ReplaySubject<google.visualization.ControlWrapper>(1);

  constructor(private loaderService: ScriptLoaderService) {}

  /**
   * Emits after the `ControlWrapper` was created.
   */
  public get wrapperReady$() {
    return this.wrapperReadySubject.asObservable();
  }

  public get controlWrapper(): google.visualization.ControlWrapper {
    if (!this._controlWrapper) {
      throw new Error(`Cannot access the control wrapper before it being initialized.`);
    }

    return this._controlWrapper;
  }

  public ngOnInit() {
    this.loaderService.loadChartPackages('controls').subscribe(() => {
      this.createControlWrapper();
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this._controlWrapper) {
      return;
    }

    if (changes.type) {
      this._controlWrapper.setControlType(this.type);
    }

    if (changes.options) {
      this._controlWrapper.setOptions(this.options || {});
    }

    if (changes.state) {
      this._controlWrapper.setState(this.state || {});
    }
  }

  private createControlWrapper() {
    this._controlWrapper = new google.visualization.ControlWrapper({
      containerId: this.id,
      controlType: this.type,
      state: this.state,
      options: this.options
    });

    this.addEventListeners();
    this.wrapperReadySubject.next(this._controlWrapper);
  }

  private addEventListeners() {
    google.visualization.events.removeAllListeners(this._controlWrapper);

    google.visualization.events.addListener(this._controlWrapper, 'ready', (event: ChartReadyEvent) =>
      this.ready.emit(event)
    );
    google.visualization.events.addListener(this._controlWrapper, 'error', (event: ChartErrorEvent) =>
      this.error.emit(event)
    );
    google.visualization.events.addListener(this._controlWrapper, 'statechange', (event: unknown) =>
      this.stateChange.emit(event)
    );
  }
}
