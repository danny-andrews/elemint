import { MintCounter } from "./mint-counter.js";
import { LitCounter } from "./lit-counter.js";

const handleCountChangedEvent = (name) =>
  document
    .querySelector(name)
    .addEventListener("count-changed", ({ detail }) => {
      console.log(`count changed in ${name}!`, detail);
    });

["mint-counter", "lit-counter"].forEach(handleCountChangedEvent);

customElements.define("mint-counter", MintCounter);
customElements.define("lit-counter", LitCounter);
