import t from "tap";
import { makeCell } from "../cell.js";
import { map, subscribe } from "../operators.js";
import { pipeline } from "../util.js";

t.test("Cell works", (is) => {
  const cell = makeCell(4);
  const values = [];

  cell.subscribe({
    next: (val) => {
      values.push(val);
    },
    complete: () => {
      is.same(values, [4, 2]);
      is.end();
    },
  });

  cell.set(2);
  cell.complete();
});

t.test("Cell works with map", (is) => {
  const cell = makeCell(2);
  const values = [];

  pipeline(
    cell,
    map((a) => a * 2),
    subscribe({
      next: (val) => {
        values.push(val);
      },
      complete: () => {
        is.same(values, [4, 6]);
        is.end();
      },
    })
  );

  cell.set(3);
  cell.complete();
});

t.test("Cell works with map", (is) => {
  const cell = makeCell(2);
  const values = [];

  const newCell = map((a) => a * 2, cell);

  subscribe({
    next: (val) => {
      values.push(val);
    },
    complete: () => {
      is.same([4, 6], values);
      is.end();
    },
  })(newCell);

  newCell.set(7);
  newCell.complete();
});
