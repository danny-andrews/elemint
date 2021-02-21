import { custom } from "lighterhtml";
import { subscribe } from "./callbags";
import Cell from "./cell";

const Renderer = (subscriptionAdded) =>
  custom({
    any: (callback) => (node, childNodes) => {
      const cb = callback.call({ type: "html" }, node, childNodes);

      return (value) => {
        if (value.type === Cell) {
          subscriptionAdded(subscribe(cb)(value));
        } else {
          cb(value);
        }
      };
    },
    attribute: (callback) => (node, name, original) => {
      const cb = callback.call({ type: "html" }, node, name, original);

      return (value) => {
        if (value.type === Cell) {
          subscriptionAdded(subscribe(cb)(value));
        } else {
          cb(value);
        }
      };
    },
  });

export default Renderer;
