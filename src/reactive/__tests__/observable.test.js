import { test } from "uvu";
import * as assert from "uvu/assert";
import Observable from "../observable.js";

test("Observable works", (done) => {
  return new Promise((resolve) => {
    Observable((observer) => {
      observer.next(4);
      observer.complete();
    }).subscribe({
      next: (val) => {
        assert.is(val, 4);
      },
      complete: () => {
        resolve();
      },
    });
  });
});

test.run();
