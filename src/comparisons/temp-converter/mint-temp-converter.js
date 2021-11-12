import makeElement from "../../component.js";

const Element = makeElement({
  props: {
    fahrenheit: { default: 32 },
    celsius: { default: 0 },
  },
  render: ({ fahrenheit, celsius }, html) => {
    const updateFahrenheit = (e) => {
      const f = e.target.value;
      fahrenheit.set(f);
      celsius.set(Math.round(((f - 32) * 5) / 9));
    };

    const updateCelsius = (e) => {
      const c = e.target.value;
      celsius.set(c);
      fahrenheit.set(Math.round((c * 9) / 5 + 32));
    };

    return html`
      <label>
        F
        <input type="number" oninput=${updateFahrenheit} value=${fahrenheit} />
      </label>
      <label>
        C
        <input type="number" oninput=${updateCelsius} value=${celsius} />
      </label>
    `;
  },
});

customElements.define("mint-temp-converter", Element);
