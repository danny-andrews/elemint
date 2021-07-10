import { Hole } from "lighterhtml";
import { html, render as renderTemplate } from "../renderer/renderer.js";
import { makeCell, syncCells } from "../reactive/index.js";
import { isCell, isObservable, supportsAdoptingStyleSheets } from "../util.js";

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

const createStyleSheet = (styles) => {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(styles);
  return sheet;
};

const Component = ({ props, render, css }) => {
  const propMap = new Map(
    Object.entries(props).map(([name, config]) => [
      name,
      normalizePropConfig(config),
    ])
  );

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

      this._subscriptions = [];
      this._root = makeCell(null);

      this.attachShadow({ mode: "open" });
      this._setupState(propConfigs);
      this._setupProperties(propConfigs);
    }

    static get observedAttributes() {
      return observedAttributes;
    }

    attributeChangedCallback(name, _, newVal) {
      if (this._internalAttributeChange) {
        return;
      }

      if (propMap.get(name).attr.parse === Boolean) {
        this._state[name].set(this.hasAttribute(name));
      } else {
        this._state[name].set(propMap.get(name).attr.parse(newVal));
      }
    }

    connectedCallback() {
      this._setupAttributes(observedAttributes);
      this._render();
    }

    disconnectedCallback() {
      this._destroy();
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
            if (isCell(value)) {
              this._subscriptions.push(syncCells(value, this._state[name]));
            } else {
              this._state[name].set(value);
            }
          },
          get: this._state[name].get,
        });
      });
    }

    _setupAttributes(attributeNames) {
      attributeNames.forEach((name) => {
        const subscription = this._state[name].subscribe((val) => {
          this._setAttribute(name, val);
        });
        this._subscriptions.push(subscription);
      });
    }

    _setupStyles(styles) {
      if (!styles) return;

      if (supportsAdoptingStyleSheets) {
        this.shadowRoot.adoptedStyleSheets = [createStyleSheet(styles)];
      } else {
        const style = document.createElement("style");
        style.textContent = styles;
        this.shadowRoot.appendChild(style);
      }
    }

    _setupState(propConfigs) {
      this._state = {};
      propConfigs.forEach((propConfig) => {
        let initialValue;
        if (this.hasAttribute(propConfig.name)) {
          if (propConfig.attr.parse === Boolean) {
            initialValue = true;
          } else {
            initialValue = propConfig.attr.parse(
              this.getAttribute(propConfig.name)
            );
          }
        } else {
          initialValue = propConfig.default;
        }

        this._state[propConfig.name] = makeCell(initialValue);
      });
    }

    _emit(eventName, detail, eventOptions = {}) {
      const event = new CustomEvent(eventName, { detail, ...eventOptions });
      this.dispatchEvent(event);
      return event;
    }

    _render() {
      let result = render(this._state, html, {
        emit: this._emit.bind(this),
        root: this._root,
        context: this,
      });
      const { template, methods } =
        result instanceof Hole ? { template: result } : result;
      if (methods) {
        Object.entries(methods).forEach(([name, fn]) => {
          this[name] = fn;
        });
      }

      renderTemplate(this.shadowRoot, template);
      // NOTE: This line must come after rendering.
      this._subscriptions.push(
        template.values.filter(isObservable).map((value) => value._subscription)
      );
      this._setupStyles(css);
      this._root.set(this.shadowRoot);
    }

    _destroy() {
      this._subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
    }
  };
};

export default Component;
