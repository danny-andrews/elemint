import t from "tap";
import Observable from "../observable.js";

t.test("Observable works", (is) => {
  Observable((observer) => {
    observer.next(4);
    observer.complete();
  }).subscribe({
    next: (val) => {
      is.same(val, 4);
    },
    complete: () => {
      is.end();
    },
  });
});
