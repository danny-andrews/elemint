export const pipeline = (arg, ...fns) => fns.reduce((v, fn) => fn(v), arg);
