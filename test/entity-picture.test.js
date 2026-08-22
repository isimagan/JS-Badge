import assert from "node:assert/strict";
import test from "node:test";

import { createBadgeModel } from "../src/badge-model.js";
import { appendBadgeVisual } from "../src/badge-renderer.js";

const stateObject = {
  entity_id: "sensor.feel24_visitors",
  state: "4",
  attributes: {
    entity_picture: "/api/feel24_visitors/icon.png",
    friendly_name: "Feel24",
    icon: "mdi:shoe-sneaker",
    unit_of_measurement: "visitors",
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

function createModel(config = {}) {
  return createBadgeModel(
    { entity: stateObject.entity_id, ...config },
    hass,
  );
}

test("entity_picture is selected by default when it exists", () => {
  const model = createModel();

  assert.equal(model.entityPicture, "/api/feel24_visitors/icon.png");
  assert.equal(model.icon, "mdi:shoe-sneaker");
});

test("a configured icon takes priority over entity_picture", () => {
  const model = createModel({ icon: "mdi:ab-testing" });

  assert.equal(model.entityPicture, "");
  assert.equal(model.icon, "mdi:ab-testing");
});

test("show_entity_picture false falls back to the entity icon", () => {
  const model = createModel({ show_entity_picture: false });

  assert.equal(model.entityPicture, "");
  assert.equal(model.icon, "mdi:shoe-sneaker");
});

test("a missing entity_picture falls back to the entity icon", () => {
  const currentHass = {
    ...hass,
    states: {
      [stateObject.entity_id]: {
        ...stateObject,
        attributes: {
          ...stateObject.attributes,
          entity_picture: undefined,
        },
      },
    },
  };
  const model = createBadgeModel(
    { entity: stateObject.entity_id },
    currentHass,
  );

  assert.equal(model.entityPicture, "");
  assert.equal(model.icon, "mdi:shoe-sneaker");
});

test("the selected entity picture is rendered as an image", () => {
  const originalDocument = globalThis.document;
  const createdElements = [];
  const iconContainer = {
    appendChild(element) {
      this.child = element;
    },
  };

  globalThis.document = {
    createElement(tagName) {
      const element = {
        tagName,
        attributes: {},
        className: "",
        setAttribute(name, value) {
          this.attributes[name] = value;
        },
      };
      createdElements.push(element);
      return element;
    },
  };

  try {
    appendBadgeVisual(iconContainer, createModel(), hass);
  } finally {
    globalThis.document = originalDocument;
  }

  assert.equal(createdElements.length, 1);
  assert.equal(iconContainer.child.tagName, "img");
  assert.equal(iconContainer.child.className, "entity-picture");
  assert.equal(
    iconContainer.child.attributes.src,
    "/api/feel24_visitors/icon.png",
  );
});
