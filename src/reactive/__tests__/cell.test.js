import { test } from "uvu";
import * as assert from "uvu/assert";
import { makeCell } from "../cell.js";
import { map, subscribe } from "../operators.js";
import { pipeline } from "../util.js";

test("Cell works", () => {
  const cell = makeCell(4);
  const values = [];

  return new Promise((resolve) => {
    cell.subscribe({
      next: (val) => {
        values.push(val);
      },
      complete: () => {
        assert.equal(values, [4, 2]);
        resolve();
      },
    });

    cell.set(2);
    cell.complete();
  });
});

test("Cell works with map", (is) => {
  const cell = makeCell(2);
  const values = [];

  return new Promise((resolve) => {
    pipeline(
      cell,
      map((a) => a * 2),
      subscribe({
        next: (val) => {
          values.push(val);
        },
        complete: () => {
          assert.equal(values, [4, 6]);
          resolve();
        },
      })
    );

    cell.set(3);
    cell.complete();
  });
});

test("Cell works with map", (is) => {
  const cell = makeCell(2);
  const values = [];
  return new Promise((resolve) => {
    pipeline(
      cell,
      map((a) => a * 2),
      subscribe({
        next: (val) => {
          values.push(val);
        },
        complete: () => {
          assert.equal(values, [4, 14]);
          resolve();
        },
      })
    );

    cell.set(7);
    cell.complete();
  });
});

test.run();
