import Subject from "callbag-behavior-subject";
import { subscribe } from "./callbags";

const Cell = (initialValue) => {
  let value = initialValue;
  const subject = Subject(value);
  subscribe((newVal) => {
    value = newVal;
  })(subject);

  subject.update = (fn) => subject(1, fn(value));
  subject.set = (value) => subject(1, value);
  subject.get = () => value;
  subject.type = Cell;

  return subject;
};

export default Cell;
