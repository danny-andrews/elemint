import NativeObservable from "core-js-pure/features/observable/index.js";

export const makeObservable = (value) =>
  Observable((emitter) => {
    emitter.next(value);
  });

const Observable = (emitterFn) => {
  const observable = new NativeObservable(emitterFn);

  return {
    subscribe: observable.subscribe.bind(observable),
    constructor: Observable,
    of: makeObservable,
  };
};

export default Observable;