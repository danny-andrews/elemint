export const pipeline = (arg, ...fns) => fns.reduce((v, fn) => fn(v), arg);

export const polyfillSymbol = (name) => {
  if (!Symbol[name]) {
    Object.defineProperty(Symbol, name, { value: Symbol(name) });
  }
};
