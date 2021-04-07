import { subscribe } from "./callbags";
import Renderer from "./renderer";
import Cell from "./cell";
import { Hole } from "lighterhtml";

const noop = () => {};

const last = (arr) => arr[arr.length - 1];

const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const generatorToArray = (generator) => {
  let array = [];
  let result;
  while (true) {
    result = generator.next();
    array.push(result.value);
    if (result.done) {
      break;
    }
  }
  return array;
};

const syncCells = (cell1, cell2) => {
  let ignoreUpdate = false;

  return pipe(
    subscribe((a) => {
      ignoreUpdate = true;
      cell1.set(a);
      ignoreUpdate = false;
    })(cell2),
    subscribe((a) => {
      if (!ignoreUpdate) {
        cell2.set(a);
      }
    })(cell1)
  );
};

const parserForValue = (value) =>
  value === undefined || typeof value === "string" ? String : value.constructor;

const normalizePropConfig = (propConfig) =>
  propConfig.attr === false
    ? propConfig
    : {
        ...propConfig,
        attr: {
          parse: parserForValue(propConfig.default),
          ...(propConfig.attr || {}),
        },
      };

const makePropMap = (props) =>
  new Map(
    Object.entries(props).map(([name, config]) => [
      name,
      normalizePropConfig(config),
    ])
  );

const createStyleSheet = (styles) => {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(styles);
  return sheet;
};

const Component = (props, init, css) => {
  const propMap = makePropMap(props);

  const propConfigs = Array.from(propMap.entries()).map(([key, value]) => ({
    name: key,
    ...value,
  }));

  const observedAttributes = propConfigs
    .filter((prop) => prop.attr !== false)
    .map((prop) => prop.name);

  return class extends HTMLElement {
    constructor() {
      super();
      this.subscriptions = [];
      this.destroy = noop;
      this.attachShadow({ mode: "open" });
      this._setupState(propConfigs);
      this._setupProperties(propConfigs);
      this._setupAttributes(observedAttributes);
    }

    static get observedAttributes() {
      return observedAttributes;
    }

    attributeChangedCallback(name, _, newVal) {
      if (this._internalAttributeChange) {
        return;
      }

      if (propMap.get(name).attr.parse === Boolean) {
        this.state[name].set(this.hasAttribute(name));
      } else {
        this.state[name].set(propMap.get(name).attr.parse(newVal));
      }
    }

    connectedCallback() {
      this._setupStyles(css);
      this._render();
    }

    disconnectedCallback() {
      this.subscriptions.forEach((dispose) => dispose());
      this.destroy();
    }

    _setAttribute(name, val) {
      if (val == null) return;

      this._internalAttributeChange = true;

      if (val === false) {
        this.removeAttribute(name);
      } else if (val === true) {
        this.setAttribute(name, "");
      } else {
        this.setAttribute(name, String(val));
      }

      this._internalAttributeChange = false;
    }

    _setupProperties(propConfigs) {
      propConfigs.forEach(({ name }) => {
        Object.defineProperty(this, name, {
          set: (value) => {
            if (value.get && value.set && value.update) {
              this.subscriptions.push(syncCells(value, this.state[name]));
            } else {
              this.state[name].set(value);
            }
          },
          get: this.state[name].get,
        });
      });
    }

    _setupAttributes(attributeNames) {
      attributeNames.forEach((name) => {
        const unsubscribe = subscribe((val) => {
          this._setAttribute(name, val);
        })(this.state[name]);
        this.subscriptions.push(unsubscribe);
      });
    }

    _setupStyles(styles) {
      if (styles) {
        this.shadowRoot.adoptedStyleSheets = [createStyleSheet(styles)];
      }
    }

    _setupState(propConfigs) {
      this.state = {};
      propConfigs.forEach((propConfig) => {
        this.state[propConfig.name] = Cell(propConfig.default);
      });
    }

    _emit(eventName, detail, eventOptions = {}) {
      const event = new CustomEvent(eventName, { detail, ...eventOptions });
      this.dispatchEvent(event);
      return event;
    }

    _render() {
      const { html, render } = Renderer((subscription) => {
        this.subscriptions.push(subscription);
      });
      let result = init(this.state, html, {
        emit: this._emit.bind(this),
        root: this.shadowRoot,
        context: this,
      });
      const values =
        typeof result.next === "function" ? generatorToArray(result) : [result];
      const actualResult = last(values);
      const subscriptions = values.slice(0, -1);
      subscriptions.forEach((sub) => {
        this.subscriptions.push(sub);
      });

      const { template, destroy, methods } =
        actualResult instanceof Hole
          ? { template: actualResult }
          : actualResult;

      if (destroy) {
        this.destroy = destroy;
      }
      if (methods) {
        Object.entries(methods).forEach(([name, fn]) => {
          this[name] = fn;
        });
      }

      render(this.shadowRoot, template);
    }
  };
};

export default Component;
