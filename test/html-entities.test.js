import assert from "node:assert/strict";
import test from "node:test";

import {
  decodeAndEscapeHtml,
  decodeHtmlEntities,
} from "../src/value-helpers.js";

const namedEntities = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  middot: "·",
  quot: '"',
};

function decodeEntity(match, entity) {
  if (entity.startsWith("#x") || entity.startsWith("#X")) {
    return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
  }

  if (entity.startsWith("#")) {
    return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
  }

  return namedEntities[entity] ?? match;
}

const documentObject = {
  createElement(tagName) {
    assert.equal(tagName, "textarea");

    return {
      value: "",
      set innerHTML(value) {
        this.value = value.replace(
          /&(#x[\da-f]+|#\d+|[a-z][\da-z]+);/gi,
          decodeEntity,
        );
      },
    };
  },
};

test("named and numeric HTML entities are decoded", () => {
  assert.equal(
    decodeHtmlEntities("På &middot; ferdig &#183; klar &#xB7;", documentObject),
    "På · ferdig · klar ·",
  );
});

test("decoded text is escaped before it is added to badge markup", () => {
  assert.equal(
    decodeAndEscapeHtml(
      "På &middot; <strong>ferdig</strong> &lt;script&gt;",
      documentObject,
    ),
    "På · &lt;strong&gt;ferdig&lt;/strong&gt; &lt;script&gt;",
  );
});
