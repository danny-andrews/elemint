import NativeObservable from "core-js-pure/features/observable/index.js";

const Observable = (emitterFn) => {
  const observable = new NativeObservable(emitterFn);

  return {
    subscribe: observable.subscribe.bind(observable),
    constructor: Observable,
  };
};

export const makeObservable = (value) =>
  Observable((emitter) => {
    emitter.next(value);
  });

export default Observable;
