import t from "tap";
import Observable from "../observable.js";
import { map, subscribe } from "../operators.js";
import { pipeline } from "../util.js";

t.test("map works", (is) => {
  pipeline(
    Observable((emitter) => {
      emitter.next(2);
      emitter.complete();
    }),
    map((val) => val * 2),
    subscribe((val) => {
      is.same(val, 4);
      is.end();
    })
  );
});
