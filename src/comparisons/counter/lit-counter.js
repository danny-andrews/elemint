import { LitElement, html } from "lit-element";

export class LitCounter extends LitElement {
  static get properties() {
    return {
      count: { type: Number, reflect: true },
      disabled: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.count = 0;
    this.disabled = false;
  }

  dispatchCountChangedEvent() {
    this.dispatchEvent(
      new CustomEvent("count-changed", {
        detail: this.count,
      }),
    );
  }

  increment() {
    this.count++;
    this.dispatchCountChangedEvent();
  }

  decrement() {
    this.count--;
    this.dispatchCountChangedEvent();
  }

  toggleDisabled() {
    this.disabled = !this.disabled;
  }

  render() {
    return html`
      <button ?disabled=${this.disabled} @click=${this.decrement}>-</button>
      <button ?disabled=${this.disabled} @click=${this.increment}>+</button>
      <button @click=${this.toggleDisabled}>Toggle Disabled</button>
      <div>Count: ${this.count}</div>
    `;
  }
}
