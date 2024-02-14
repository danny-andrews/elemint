import { test, expect } from "vitest";
import Observable from "../observable.js";

test("Observable works", (done) => {
  return new Promise((resolve) => {
    Observable((observer) => {
      observer.next(4);
      observer.complete();
    }).subscribe({
      next: (val) => {
        expect(val).toBe(4);
      },
      complete: () => {
        resolve();
      },
    });
  });
});
