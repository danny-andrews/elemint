import NativeObservable from "core-js-pure/features/observable/index.js";
import { curryN, pipe } from "ramda";

const normalizeObserver = (observer = {}, ...rest) =>
  typeof observer === 'function'
    ? {
      next: observer,
      error: rest[1],
      complete: rest[2]
    }
    : observer;

export const Observable = (observer) => {
  const observable = new NativeObservable(observer);

  const result = {
    subscribe: observable.subscribe.bind(observable),
    pipe(...fns) {
      return pipe(...fns)(this)
    },
    constructor: Observable
  }

  return result;
};

const Cell = (initialValue) => {
  const observable = Observable(() => {});
  let currentValue = initialValue;
  const observers = new Set();

  const subscribe = (observer) => {
    const normalizedObserver = normalizeObserver(observer);
    normalizedObserver.next(currentValue);
    observers.add(normalizedObserver);

    return {
      closed: false,
      unsubscribe: () => {
        observers.delete(normalizedObserver);
      }
    };
  };

  const get = () => currentValue;

  const set = (value) => {
    currentValue = value;
    observers.forEach(observer => {
      observer.next(value)
    });
  };

  const update = (fn) => {
    set(fn(currentValue));
  }

  return {
    ...observable,
    subscribe,
    get,
    set,
    update,
    constructor: Cell
  };
};

export const map = curryN(2, (fn, observable) => {
  return observable.constructor(
    observer => observable.subscribe({
      next: (value) => {
        try { value = fn(value); }
        catch (e) { return observer.error(e) }
        observer.next(value);
      },
      error: observer.error.bind(observer),
      complete: observer.complete.bind(observer),
    })
  )
});

export const filter = curryN(2, (fn, observable) => {
  return observable.constructor(emitter => observable.subscribe({
    next: (value) => {
      try { if (!fn(value)) return; }
      catch (e) { return emitter.error(e) }
      emitter.next(value);
    },
    error: emitter.error.bind(emitter),
    complete: emitter.complete.bind(emitter),
  }));
});

export const combineLatest = (...sources) =>
  new Observable(observer => {
    if (sources.length === 0)
      return Observable.from([]);

    let count = sources.length;
    let seen = new Set();
    let seenAll = false;
    let values = sources.map(() => undefined);

    let subscriptions = sources.map((source, index) => Observable.from(source).subscribe({
      next(v) {
        values[index] = v;

        if (!seenAll) {
          seen.add(index);
          if (seen.size !== sources.length)
            return;

          seen = null;
          seenAll = true;
        }

        observer.next(Array.from(values));
      },
      error(e) {
        observer.error(e);
      },
      complete() {
        if (--count === 0)
          observer.complete();
      },
    }));

    return () => subscriptions.forEach(s => s.unsubscribe());
  });

export default Cell;
