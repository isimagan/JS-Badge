import assert from "node:assert/strict";
import test from "node:test";

import { BADGE_STYLES } from "../src/styles.js";
import { readStrictBooleanValue } from "../src/value-helpers.js";

globalThis.HTMLElement = class {};

const { JsBadge } = await import("../src/js-badge.js");

const hass = {
  states: {
    "light.example": {
      entity_id: "light.example",
      state: "off",
      attributes: {},
    },
  },
};

function readShowBadge(value, currentHass = hass) {
  const config = { show_badge: value };
  const stateObject = currentHass.states["light.example"];

  return readStrictBooleanValue(
    value,
    true,
    { config, hass: currentHass, stateObject },
    "show_badge",
  );
}

test("show_badge defaults to true", () => {
  assert.equal(readShowBadge(undefined), true);
});

test("show_badge accepts boolean values", () => {
  assert.equal(readShowBadge(true), true);
  assert.equal(readShowBadge(false), false);
});

test("show_badge evaluates JavaScript templates on the current state", () => {
  const value = '[[[ return entity.state === "on"; ]]]';

  assert.equal(readShowBadge(value), false);
  assert.equal(
    readShowBadge(value, {
      states: {
        ...hass.states,
        "light.example": {
          ...hass.states["light.example"],
          state: "on",
        },
      },
    }),
    true,
  );
});

test("show_badge falls back to true when a template is not boolean", () => {
  const originalWarn = console.warn;
  console.warn = () => {};

  try {
    assert.equal(readShowBadge('[[[ return "false"; ]]]'), true);
  } finally {
    console.warn = originalWarn;
  }
});

test("the badge host and rendered content are hidden when show_badge is false", () => {
  let contentCleared = false;
  const badge = Object.create(JsBadge.prototype);

  badge._config = { show_badge: false };
  badge._hass = hass;
  badge.hidden = false;
  badge.parentElement = null;
  badge.closest = () => null;
  badge.dispatchEvent = () => {};
  badge.shadowRoot = {
    replaceChildren() {
      contentCleared = true;
    },
  };

  badge._render();

  assert.equal(badge.hidden, true);
  assert.equal(contentCleared, true);
});

test("hidden badges are forced out of the layout", () => {
  assert.match(
    BADGE_STYLES,
    /:host\(\[hidden\]\)\s*{\s*display:\s*none\s*!important;/,
  );
});

test("show_badge false remains visible in dashboard editor preview", () => {
  let visibilityEvent;
  const badge = Object.create(JsBadge.prototype);

  badge.hidden = true;
  badge.parentElement = { preview: true };
  badge.closest = () => null;
  badge.dispatchEvent = (event) => {
    visibilityEvent = event;
  };

  const visible = badge._setBadgeVisibility(false);

  assert.equal(visible, true);
  assert.equal(badge.hidden, false);
  assert.equal(visibilityEvent.type, "badge-visibility-changed");
  assert.deepEqual(visibilityEvent.detail, { value: true });
});
