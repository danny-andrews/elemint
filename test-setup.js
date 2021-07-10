import { JSDOM } from "jsdom";

const { window } = new JSDOM(`<!DOCTYPE html>`).window;
global.window = window;
global.document = window.document;
global.CSSStyleSheet = window.CSSStyleSheet;
global.HTMLElement = window.HTMLElement;
global.customElements = window.customElements;
global.CustomEvent = window.CustomEvent;
