import Observable, { makeObservable } from "./observable";

export const combineLatest = (...sources) =>
  Observable((observer) => {
    if (sources.length === 0) return makeObservable([]);

    let count = sources.length;
    let seen = new Set();
    let seenAll = false;
    let values = sources.map(() => undefined);

    let subscriptions = sources.map((source, index) =>
      source.subscribe({
        next(v) {
          values[index] = v;

          if (!seenAll) {
            seen.add(index);
            if (seen.size !== sources.length) return;

            seen = null;
            seenAll = true;
          }

          observer.next(Array.from(values));
        },
        error(e) {
          observer.error(e);
        },
        complete() {
          if (--count === 0) observer.complete();
        },
      })
    );

    return () => subscriptions.forEach((s) => s.unsubscribe());
  });
