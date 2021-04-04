import makeElement from "../src/component";
import { map, subscribe } from "../src/callbags";

const KEYCODES = {
  ENTER: 13,
  SPACE: 32,
};

let count = 0;

const Element = makeElement(
  {
    disabled: { default: false },
    checked: { default: false },
    label: {},
  },
  ({ disabled, checked, label }, html, { emit }) => {
    const toggleChecked = () => {
      if (!disabled.get()) {
        checked.update((a) => !a);
      }
    };

    const onKeyDown = (event) => {
      switch (event.keyCode) {
        case KEYCODES.SPACE:
        case KEYCODES.ENTER:
          event.preventDefault();
          toggleChecked();
          break;
      }
    };

    const labelId = `label-${count}`;
    const ariaLabelledBy = map((label) => (!label ? labelId : null))(label);
    const ariaDescribedBy = map((label) => (!label ? labelId : null))(label);
    const ariaLabel = map((label) => label || null)(label);
    const ariaDisabled = map((disabled) => disabled || null)(disabled);
    const tabIndex = map((disabled) => (disabled ? -1 : 0))(disabled);
    const labelStyle = map((label) => (!label ? { marginRight: "10px" } : {}))(
      label
    );

    subscribe((checked) => {
      // Emit events
      emit("checked-changed", checked);
    })(checked);

    count++;

    return {
      template: html`
        <label style=${labelStyle} id=${labelId} part="label">
          <slot></slot>
        </label>
        <div
          onclick=${toggleChecked}
          onkeydown=${onKeyDown}
          part="button"
          class="button"
          tabindex=${tabIndex}
          role="switch"
          aria-checked=${checked}
          aria-disabled=${ariaDisabled}
          aria-label=${ariaLabel}
          aria-labelledby=${ariaLabelledBy}
          aria-describedby=${ariaDescribedBy}
        >
          <div part="track" class="track"></div>
          <div part="thumb" class="thumb"></div>
        </div>
      `,
      methods: {
        toggle: toggleChecked,
      },
    };
  },
  `
    :host {
      display: flex;
      align-items: center;
    }

    :host([checked]) .thumb {
      right: 0px;
    }

    :host([disabled]) {
      opacity: 50%;
    }

    .button {
      display: inline-block;
      position: relative;
      height: 16px;
      width: 36px;
    }

    .track {
      height: 100%;
      background-color: lightgrey;
    }

    .thumb {
      right: 18px;
      transition: right .1s;
      top: 0;
      position: absolute;
      width: 50%;
      height: 100%;
      background-color: grey;
    }

    div[part="button"]:focus-visible,
    div[part="button"]:focus:not(:focus-visible) {
      outline: none;
    }

    div[part="button"]:focus .thumb {
      box-shadow: var(--generic-switch-focus, 0 0 0 2px #145dce);
    }

    div[part="button"]:focus:not(:focus-visible) .thumb {
      box-shadow: none;
    }

    label[part="label"] {
      user-select: none;
    }
  `
);

customElements.define("my-switch", Element);
