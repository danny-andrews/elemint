import Cell from "../src/cell";

document.addEventListener("DOMContentLoaded", () => {
  const counter = document.querySelector("fp-counter");
  const newCount = Cell(13);
  counter.count = newCount;
  counter.addEventListener("count-changed", (e) => {
    console.log("count changed", e.detail);
  });
});
