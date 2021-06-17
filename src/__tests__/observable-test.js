import t from "tap";
import Cell, { Observable, filter, map } from "../cell.js";

const toPromise = (observable) => {
  let vals = [];
  return new Promise((resolve, reject) => {
    observable.subscribe({
      next: (val) => {
        vals = [...vals, val];
      },
      error: reject,
      complete: () => {
        resolve(vals);
      }
    })
  })
};

t.test("pipe pipes functions through", (is) => {
  const obs = Observable((emitter) => {
    emitter.next(1);
    emitter.next(2);
    emitter.next(3);
    emitter.complete();
  });
  const newObs = obs
    .pipe(map(a => a * 2), filter(a => a !== 4))
    // .thru(filter(a => a !== 4));
  return toPromise(newObs).then((vals) => {
    is.same(vals, [2, 6]);
  }).catch(err => {
    console.log(err)
  })
});

t.test("cell works", async (is) => {
  const cell = Cell(4);
  cell.set(6);
  is.equal(cell.get(), 6);
});
