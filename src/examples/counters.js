import makeElement from "../make-element.js";
import { map } from "../reactive/index.js";

export const Counters = makeElement({
  props: {
    counts: { default: [], attr: false },
  },
  render: ({ counts }, html) => {
    const createCounter = () => {
      counts.update((oldCounts) => [
        ...oldCounts,
        { initial: oldCounts.length },
      ]);
    };

    const onDelete = (countToDelete) => {
      counts.update((oldCounts) =>
        oldCounts.filter((count) => count !== countToDelete),
      );
    };

    const counters = map(
      (counts) =>
        counts.map((count) => {
          return html.for(count)`
            <mint-counter
              .onDelete=${() => onDelete(count)}
              count=${count.initial}
              multiplier=${count.initial}
            ></mint-counter>
          `;
        }),
      counts,
    );

    return html`
      <button onclick=${createCounter}>Create Counter</button>
      <div class="counters">${counters}</div>
    `;
  },
  css: `
    .counters {
      margin-top: 12px;
    }
  `,
});
