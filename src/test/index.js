import { asStatic, asTag } from "static-params";
import { render, html } from "../renderer.js";

const staticHtml = asTag(html);

let id = 0;
const renderElement = (Element, props = {}) => {
  const name = `test-${id++}`;
  const staticName = asStatic(name);
  const propArray = Object.entries(props);
  const staticProps = asStatic(
    propArray.length === 0
      ? ""
      : ` ${propArray.map(([key, value]) => `${key}="${value}"`).join(" ")}`
  );
  customElements.define(name, Element);
  render(
    document.body,
    staticHtml`<${staticName} ${staticProps}></${staticName}>`
  );
  return document.querySelector(name);
};

export { renderElement };
