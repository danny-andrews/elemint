export const operate = (init) => (source) =>
  source.lift((observable, liftedSource) => {
    try {
      return init(liftedSource, observable);
    } catch (err) {
      observable.error(err);
    }
  });

export const filter = (predicate) =>
  operate((source, subscriber) => {
    let index = 0;

    source.subscribe((value) => {
      if (predicate(value, index++)) {
        subscriber.next(value);
      }
    });
  });
