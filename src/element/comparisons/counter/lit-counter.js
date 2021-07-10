import { LitElement, html } from "lit-element";

class Element extends LitElement {
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
      })
    );
  }

  decrement() {
    this.count--;
    this.dispatchCountChangedEvent();
  }

  increment() {
    this.count++;
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

customElements.define("lit-counter", Element);
