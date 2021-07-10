import { test } from "uvu";
import * as assert from "uvu/assert";
import Observable from "../observable.js";
import { map, subscribe } from "../operators.js";
import { pipeline } from "../util.js";

test("map works", () => {
  return new Promise((resolve) => {
    pipeline(
      Observable((emitter) => {
        emitter.next(2);
        emitter.complete();
      }),
      map((val) => val * 2),
      subscribe((val) => {
        assert.is(val, 4);
        resolve();
      })
    );
  });
});

test.run();
