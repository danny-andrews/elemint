import { LitElement, html } from "lit-element";

class Element extends LitElement {
  static get properties() {
    return {
      fahrenheit: { type: Number, reflect: true },
      celsius: { type: Number, reflect: true },
    };
  }

  constructor() {
    super();
    this.fahrenheit = 32;
    this.celsius = 0;
  }

  updateFahrenheit(e) {
    const f = e.target.value;
    this.fahrenheit = f;
    this.celsius = Math.round(((f - 32) * 5) / 9);
  }

  updateCelsius(e) {
    const c = e.target.value;
    this.celsius = c;
    this.fahrenheit = Math.round((c * 9) / 5 + 32);
  }

  render() {
    return html`
      <label>
        F
        <input
          type="number"
          @input=${this.updateFahrenheit}
          value=${this.fahrenheit}
        />
      </label>
      <label>
        C
        <input
          type="number"
          @input=${this.updateCelsius}
          value=${this.celsius}
        />
      </label>
    `;
  }
}

customElements.define("lit-temp-converter", Element);
