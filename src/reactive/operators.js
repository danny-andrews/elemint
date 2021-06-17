import { curryN } from "ramda";

export const map = curryN(2, (fn, observable) => {
  return observable.constructor((observer) =>
    observable.subscribe({
      next: (value) => {
        try {
          value = fn(value);
        } catch (e) {
          return observer.error(e);
        }
        observer.next(value);
      },
      error: observer.error.bind(observer),
      complete: observer.complete.bind(observer),
    })
  );
});

export const filter = curryN(2, (fn, observable) => {
  return observable.constructor((emitter) =>
    observable.subscribe({
      next: (value) => {
        try {
          if (!fn(value)) return;
        } catch (e) {
          return emitter.error(e);
        }
        emitter.next(value);
      },
      error: emitter.error.bind(emitter),
      complete: emitter.complete.bind(emitter),
    })
  );
});

export const forEach = curryN(
  2,
  (fn, observable) =>
    new Promise((resolve, reject) => {
      let subscription = observable.subscribe({
        next(value) {
          try {
            fn(value);
          } catch (e) {
            reject(e);
            subscription.unsubscribe();
          }
        },
        error: reject,
        complete: resolve,
      });
    })
);

export const subscribe =
  (...args) =>
  (observable) => {
    observable.subscribe(...args);
  };
