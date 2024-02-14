import makeElement from "../make-element.js";
import { map } from "../reactive/index.js";

const Counters = makeElement({
  props: {
    counts: { default: [], attr: false },
    multiplier: { default: 1 },
  },
  render: ({ counts, multiplier }, html) => {
    const createCounter = () => {
      counts.update((oldCounts) => [
        ...oldCounts,
        {
          initial: oldCounts.length + 1,
          multiplier: multiplier.get(),
        },
      ]);
      multiplier.update((old) => old + 1);
    };

    const onDelete = (countToDelete) => {
      counts.update((oldCounts) =>
        oldCounts.filter((count) => count !== countToDelete)
      );
    };

    const counters = map(
      (counts) =>
        counts.map((count) => {
          const { initial, multiplier } = count;

          return html.for(count)`
            <mint-counter
              .onDelete=${() => onDelete(count)}
              count=${initial}
              multiplier=${multiplier}
            ></mint-counter>
          `;
        }),
      counts
    );

    return html`
      <button onclick=${createCounter}>Create Counter</button>
      <input value=${multiplier} type="number" />
      <div class="counters">${counters}</div>
    `;
  },
  css: `
    .counters {
      margin-top: 12px;
    }
  `,
});

customElements.define("mint-counters", Counters);
