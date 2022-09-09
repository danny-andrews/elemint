import NativeObservable from "./native-observable.js";

export const makeObservable = (value) =>
  Observable((emitter) => {
    emitter.next(value);
  });

const Observable = (subscriber) => {
  const observable = new NativeObservable(subscriber);
  const lift = (fn) => fn(observable, subscriber);

  return {
    subscribe: observable.subscribe.bind(observable),
    constructor: Observable,
    of: Observable,
    lift,
  };
};

export default Observable;
