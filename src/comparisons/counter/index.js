import "./mint-counter.js";
import "./lit-counter.js";

const handleCountChangedEvent = (name) =>
  document
    .querySelector(name)
    .addEventListener("count-changed", ({ detail }) => {
      console.log(`count changed in ${name}!`, detail);
    });

["mint-counter", "lit-counter"].forEach(handleCountChangedEvent);
