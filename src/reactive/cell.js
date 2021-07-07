import { noop } from "../util.js";

const normalizeObserver = (observer = {}, ...rest) =>
  typeof observer === "function"
    ? {
        next: observer,
        error: rest[1] || noop,
        complete: rest[2] || noop,
      }
    : observer;

export const makeCell = (value) =>
  Cell((emitter) => {
    emitter.next(value);
  });

const Cell = (emitterFn) => {
  let isClosed = false;
  let currentValue;
  const observers = new Set();

  const complete = () => {
    isClosed = true;
    observers.forEach((observer) => {
      observer.complete();
    });
    observers.clear();
  };

  const set = (value) => {
    currentValue = value;
    observers.forEach((observer) => {
      observer.next(value);
    });
  };

  const error = (error) => {
    observers.forEach((observer) => {
      observer.error(error);
    });
  };

  const subscribe = (observer) => {
    const observerObj = normalizeObserver(observer);
    observerObj.next(currentValue);
    observers.add(observerObj);

    return {
      closed: isClosed,
      unsubscribe: () => {
        observers.delete(observerObj);
      },
    };
  };

  const get = () => currentValue;

  const update = (fn) => {
    set(fn(currentValue));
  };

  emitterFn({
    next: set,
    error,
    complete,
  });

  return {
    subscribe,
    get,
    set,
    update,
    complete,
    constructor: Cell,
    of: makeCell,
  };
};

export default Cell;
