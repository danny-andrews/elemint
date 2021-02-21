export { default as pipe } from "callbag-pipe";
export { default as combine } from "callbag-combine";
export { default as subscribe } from "callbag-subscribe";
export { default as skip } from "callbag-skip";

import Cell from "./cell";
import cbMap from "callbag-map";

export const map = (fn) => (observable) => {
  const res = cbMap(fn)(observable);
  res.type = Cell;
  return res;
};
