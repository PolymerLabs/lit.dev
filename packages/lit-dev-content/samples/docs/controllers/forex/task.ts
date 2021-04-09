/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {notEqual} from '@lit/reactive-element';
import {ReactiveControllerHost} from '@lit/reactive-element/reactive-controller.js';

export type TaskFunction<T extends [...unknown[]], R> = (args: T) => R | typeof initialState | Promise<R | typeof initialState> | Promise<typeof initialState>;
export type DepsFunction<T extends [...unknown[]]> = () => T;

/**
 * States for task status
 */
export const TaskStatus = {
  INITIAL: 0,
  PENDING: 1,
  COMPLETE: 2,
  ERROR: 3,
} as const;

export const initialState = Symbol();

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export type StatusRenderer<R> = {
  initial?: () => unknown;
  pending?: () => unknown;
  complete?: (value: R) => unknown;
  error?: (error: unknown) => unknown;
};

// TODO(sorvell): Some issues:
// 1. When task is triggered in `updated`, this generates a ReactiveElement
// warning that the update was triggered in response to an update.
// 2. And as a result of triggering in `updated`, if the user waits for the
// `updateComplete` promise they will not see a `pending` state since this
// will be triggered in another update; they would need to
// `while (!(await el.updateComplete));`.
// 3. If this is instead or additionally triggered in `willUpdate`, the
// warning goes away in the common case that the update itself does not change
// the deps; however, the `requestUpdate` to render pending state  will not
// trigger another update since the element is updating. This `requestUpdate`
// could be triggered in updated, but that results in the same issue as #2.
// 4. There is no good signal for when the task has resolved and rendered other
// than requestAnimationFrame. The user would need to store a promise for the
// task and then wait for that and the element to update.

/**
 * A controller that performs an asynchronous task like a fetch when its host
 * element updates. The controller performs an update on the host element
 * when the task becomes pending and when it completes. The task function must
 * be supplied and can take a list of dependencies specified as a function that
 * returns a list of values. The `value` property reports the completed value,
 * and the `error` property an error state if one occurs. The `status` property
 * can be checked for status and is of type `TaskStatus` which has states for
 * initial, pending, complete, and error. The `render` method accepts an
 * object with optional corresponding state method to easily render values
 * corresponding to the task state.
 *
 * class MyElement extends ReactiveElement {
 *   url = 'example.com/api';
 *   id = 0;
 *   task = new Task(
 *     this,
 *     ([url, id]) =>
 *       fetch(`${this.url}?id=${this.id}`).then(response => response.json()),
 *     () => [this.id, this.url]
 *   );
 *
 *   update(changedProperties) {
 *     super.update(changedProperties);
 *     this.task.render({
 *       pending: () => console.log('task pending'),
 *       complete: (value) => console.log('task value', value);
 *     });
 *   }
 * }
 */
export class Task<T extends [...unknown[]] = any, R = any> {
  private _previousDeps: T = [] as unknown as T;
  private _task: TaskFunction<T, R>;
  private _getDependencies: DepsFunction<T>;
  private _callId = 0;
  private _host: ReactiveControllerHost;
  private _value?: R;
  private _error?: unknown;
  status: TaskStatus = TaskStatus.INITIAL;

  constructor(
    host: ReactiveControllerHost,
    task: TaskFunction<T, R>,
    getDependencies: DepsFunction<T>
  ) {
    this._host = host;
    this._host.addController(this);
    this._task = task;
    this._getDependencies = getDependencies;
  }

  hostUpdated() {
    this._completeTask();
  }

  private async _completeTask() {
    const deps = this._getDependencies();
    if (this._isDirty(deps)) {
      this.status = TaskStatus.PENDING;
      this._error = undefined;
      this._value = undefined;
      let value!: R | typeof initialState;
      let error: unknown;
      // Request an update to report pending state.
      this._host.requestUpdate();
      const key = ++this._callId;
      try {
        value = await this._task(deps);
      } catch (e) {
        error = e;
      }
      // If this is the most recent task call, process this value.
      if (this._callId === key) {
        if (value === initialState) {
          this.status = TaskStatus.INITIAL;
        } else {
          this.status =
            error === undefined ? TaskStatus.COMPLETE : TaskStatus.ERROR;
          this._value = value!;
          this._error = error;
        }
        // Request an update with the final value.
        this._host.requestUpdate();
      }
    }
  }

  get value() {
    return this._value;
  }

  get error() {
    return this._error;
  }

  render(renderer: StatusRenderer<R>) {

    switch (this.status) {
      case TaskStatus.INITIAL:
        return renderer.initial?.();
      case TaskStatus.PENDING:
        return renderer.pending?.();
      case TaskStatus.COMPLETE:
        return renderer.complete?.(this.value!);
      case TaskStatus.ERROR:
        return renderer.error?.(this.error);
      default:
        this.status as void;
    }
  }

  private _isDirty(deps: T) {
    let i = 0;
    const previousDeps = this._previousDeps;
    this._previousDeps = deps;
    for (const dep of deps) {
      if (notEqual(dep, previousDeps[i])) {
        return true;
      }
      i++;
    }
    return false;
  }
}
