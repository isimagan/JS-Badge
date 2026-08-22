import assert from "node:assert/strict";
import test from "node:test";

import { createBadgeModel } from "../src/badge-model.js";
import { DEFAULT_STYLES } from "../src/constants.js";

const stateObject = {
  entity_id: "sensor.example",
  state: "4",
  attributes: {
    friendly_name: "Example sensor",
    icon: "mdi:counter",
  },
};

const hass = {
  states: {
    [stateObject.entity_id]: stateObject,
  },
  formatEntityState() {
    return "4 visitors";
  },
};

test("name, label, visibility and color parameters are supported", () => {
  const model = createBadgeModel(
    {
      entity: stateObject.entity_id,
      name: "Feel24",
      label: "4",
      color: "green",
      show_name: false,
      show_label: false,
    },
    hass,
  );

  assert.equal(model.name, "Feel24");
  assert.equal(model.label, "4");
  assert.equal(model.showName, false);
  assert.equal(model.showLabel, false);
  assert.equal(model.styleVariables["--js-badge-icon-color"], "green");
});

test("removed aliases no longer affect the badge", () => {
  const model = createBadgeModel(
    {
      entity: stateObject.entity_id,
      primary: "Old label",
      secondary: "Old name",
      icon_color: "red",
      show_primary: false,
      show_secondary: false,
    },
    hass,
  );

  assert.equal(model.name, "Example sensor");
  assert.equal(model.label, "4 visitors");
  assert.equal(model.showName, true);
  assert.equal(model.showLabel, true);
  assert.equal(
    model.styleVariables["--js-badge-icon-color"],
    DEFAULT_STYLES.iconColor,
  );
});
