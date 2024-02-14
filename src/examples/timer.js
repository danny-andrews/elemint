import makeElement from "../make-element";
import {
  map,
  fromEvent,
  chain,
  scan,
  periodic,
  sample,
  filter,
} from "../reactive/index.js";

const PERCISION = 2;

const Counter = makeElement({
  render: (_, html, { root }) => {
    const isRunning = scan(
      (value) => !value,
      false,
      chain(
        fromEvent("click"),
        map((node) => node.querySelector(".action"), root)
      )
    );
    const time = scan(
      (val) => (val += 1 / 10 ** PERCISION),
      0,
      filter(
        (v) => v === true,
        sample(periodic(10 ** (3 - PERCISION)), isRunning)
      )
    );

    // Render values
    const displayTime = map((time) => time.toFixed(PERCISION), time);
    const buttonText = map(
      (isRunning) => (isRunning ? "Stop" : "Start"),
      isRunning
    );

    return html`
      <div class="timer">
        <button class="action">${buttonText}</button>
        <div class="time">${displayTime}s</div>
      </div>
    `;
  },
  css: `
    .timer {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      margin-top: .5rem;
      margin-left: .5rem;
      padding: .5rem;
      border: 1px dashed black;
    }

    .time {
      margin-top: .25rem;
    }
  `,
});

customElements.define("mint-timer", Counter);
