import { makeCell } from "../src/reactive/index";

document.addEventListener("DOMContentLoaded", () => {
  const counter = document.querySelector("fp-counter");
  const newCount = makeCell(13);
  counter.count = newCount;
  counter.addEventListener("count-changed", (e) => {
    console.log("count changed", e.detail);
  });
});
