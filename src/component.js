import { subscribe } from "./callbags";
import Renderer from "./renderer";
import Cell from "./cell";

const fromPairs = (pairs) => pairs.reduce(
  (acc, [key, value]) => ({ ...acc, [key]: value }),
  {}
);

const noop = () => {};

const normalizePropConfigs = propConfigs => propConfigs.map(propConfig =>
  propConfig.attr === false
    ? propConfig
    : {
      ...propConfig,
      attr: {
        parse: propConfig.default !== undefined
          ? propConfig.default.constructor
          : String,
        ...(propConfig.attr || {})
      }
    }
);

const createStyleSheet = (styles) => {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(styles);
  return sheet;
};

const Component = ({ props, styles }, cb) => {
  const propConfigs = normalizePropConfigs(props);
  
  const propMap = fromPairs(
    propConfigs.map((propConfig) => [propConfig.name, propConfig])
  );
  const state = fromPairs(
    propConfigs.map((propConfig) => [propConfig.name, Cell(propConfig.default)])
  );

  const observedAttributes = propConfigs
    .filter((prop) => prop.attr !== false)
    .map((prop) => prop.name);

  return class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.subscriptions = [];
      this.renderer = Renderer((a) => {
        this.subscriptions.push(a);
      });
      this.destroy = noop;
      this.shadowRoot.adoptedStyleSheets = [createStyleSheet(styles)];
    }

    static get observedAttributes() {
      return observedAttributes;
    }

    attributeChangedCallback(name, _, newVal) {
      if (this._internalAttributeChange) {
        this._internalAttributeChange = false;
        return;
      }

      if(propMap[name].attr.parse === Boolean) {
        state[name].set(this.hasAttribute(name));
      } else {
        state[name].set(propMap[name].attr.parse(newVal));
      }
    }

    connectedCallback() {
      this._setupProperties();
      this._setupAttributes();
      this._render();
    }

    disconnectedCallback() {
      this.subscriptions.forEach((dispose) => dispose());
      this.destroy();
    }

    _setAttribute(name, val) {
      if(val == null) return;

      this._internalAttributeChange = true;

      if(val === false) {
        this.removeAttribute(name);
      } else if(val === true) {
        this.setAttribute(name, '');
      } else {
        this.setAttribute(name, String(val))
      }
    }

    _setupProperties() {
      propConfigs.forEach(({ name }) => {
        Object.defineProperty(this, name, {
          set: value => {
            state[name].set(value);
          },
          get: state[name].get
        })
      });
    }

    _setupAttributes() {
      propConfigs
        .filter(({ attr }) => attr !== false)
        .forEach(({ name }) => {
          const unsubscribe = subscribe((val) => {
            this._setAttribute(name, val);
          })(state[name]);
          this.subscriptions.push(unsubscribe);
        });
    }

    _emit(eventName, detail, eventOptions = {}) {
      const event = new CustomEvent(eventName, { detail, ...eventOptions });
      this.dispatchEvent(event);
      return event;
    }

    _render() {
      const { render, html } = this.renderer;
      const result = cb(state, {
        html,
        emit: this._emit.bind(this),
        root: this.shadowRoot,
        context: this,
      });
      const [dom, onDestroy] = [].concat(result);

      if (onDestroy) {
        this.destroy = onDestroy;
      }

      render(this.shadowRoot, dom);
    }
  };
};

export default Component;
