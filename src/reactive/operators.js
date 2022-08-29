import { curryN } from "ramda";
import Observable from "./observable.js";

export const scan = curryN(3, (fn, initialValue, observable) => {
  let acc = initialValue;
  let index = 0;
  return Observable((observer) => {
    observer.next(initialValue);
    observable.subscribe((value) => {
      acc = fn(acc, value, index++);
      observer.next(acc);
    });
  });
});

export const periodic = (period) => {
  return Observable((observer) => {
    const timerId = setInterval(() => {
      observer.next(undefined);
    }, period);

    return () => {
      clearInterval(timerId);
    };
  });
};

export const skipWhile = curryN(2, (predicate, observable) => {
  return Observable((observer) => {
    observable.subscribe((value) => {
      if (!predicate(value)) {
        observer.next(value);
      }
    });
  });
});

export const map = curryN(2, (fn, observable) => {
  let index = 0;
  return Observable((observer) =>
    observable.subscribe({
      next: (value) => {
        try {
          value = fn(value, index++);
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
  let index = 0;
  return Observable((emitter) =>
    observable.subscribe({
      next: (value) => {
        try {
          if (!fn(value, index++)) return;
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

export const fromEvent = curryN(2, (eventName, node) => {
  return Observable((observer) => {
    const handler = (event) => observer.next(event);

    node.addEventListener(eventName, handler);

    return () => {
      node.removeEventListener(eventName, handler);
    };
  });
});

export const chain = curryN(2, (fn, observable) => {
  return Observable((observer) => {
    let subscription;
    observable.subscribe({
      next: (node) => {
        subscription = fn(node).subscribe((event) => {
          observer.next(event);
        });
      },
      complete: () => {
        subscription.unsubscribe();
      },
    });
  });
});

export const sample = curryN(2, (sampler, values) => {
  return Observable((observer) => {
    let value;
    const sub1 = values.subscribe((val) => {
      value = val;
    });
    const sub2 = sampler.subscribe(() => {
      observer.next(value);
    });

    return () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
    };
  });
});

export const subscribe =
  (...args) =>
  (observable) => {
    observable.subscribe(...args);
  };
