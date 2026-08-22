import assert from "node:assert/strict";
import test from "node:test";

import { createBadgeModel } from "../src/badge-model.js";
import { formatEntityState } from "../src/entity-state.js";

const visitors = {
  entity_id: "sensor.feel24_visitors",
  state: "4",
  attributes: {
    friendly_name: "Feel24",
    unit_of_measurement: "visitors",
  },
};

const hass = {
  states: {
    [visitors.entity_id]: visitors,
  },
  formatEntityState(stateObject) {
    return `${stateObject.state} ${stateObject.attributes.unit_of_measurement}`;
  },
};

test("show_unit defaults to true", () => {
  assert.equal(formatEntityState({}, hass, visitors), "4 visitors");
});

test("show_unit accepts a JavaScript template", () => {
  const hiddenUnit = createBadgeModel(
    {
      entity: visitors.entity_id,
      show_unit: "[[[ return false; ]]]",
    },
    hass,
  );
  const visibleUnit = createBadgeModel(
    {
      entity: visitors.entity_id,
      show_unit: "[[[ return true; ]]]",
    },
    hass,
  );

  assert.equal(hiddenUnit.label, "4");
  assert.equal(visibleUnit.label, "4 visitors");
});

test("show_unit false removes the unit from the default state", () => {
  assert.equal(
    formatEntityState({ show_unit: false }, hass, visitors),
    "4",
  );
});

test("show_unit false does not bypass Home Assistant formatting without a unit", () => {
  const stateObject = {
    entity_id: "sensor.status",
    state: "ready",
    attributes: {},
  };
  const currentHass = {
    formatEntityState() {
      return "Ready";
    },
  };

  assert.equal(
    formatEntityState({ show_unit: false }, currentHass, stateObject),
    "Ready",
  );
});
