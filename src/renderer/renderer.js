import { custom } from "lighterhtml";

const Renderer = (subscriptionAdded) =>
  custom({
    any: (callback) => (node, childNodes) => {
      const cb = callback.call({ type: "html" }, node, childNodes);

      return (value) => {
        if (typeof value.subscribe === 'function') {
          subscriptionAdded(value.subscribe(cb).unsubscribe);
        } else {
          cb(value);
        }
      };
    },
    attribute: (callback) => (node, name, original) => {
      const cb = callback.call({ type: "html" }, node, name, original);

      return (value) => {
        if (typeof value.subscribe === 'function') {
          subscriptionAdded(value.subscribe(cb).unsubscribe);
        } else {
          cb(value);
        }
      };
    },
  });

export default Renderer;
