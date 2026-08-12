import { evaluateTemplate } from "./template.js";

export function readValue(value, context) {
  return evaluateTemplate(value, context);
}

export function readStyleValue(value, fallback, context) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return readValue(value, context);
}

export function readBooleanValue(value, fallback, context) {
  if (value === undefined || value === null) {
    return fallback;
  }

  const evaluated = readValue(value, context);

  if (typeof evaluated === "boolean") {
    return evaluated;
  }

  if (typeof evaluated === "string") {
    return evaluated.toLowerCase() !== "false";
  }

  return Boolean(evaluated);
}

export function readStrictBooleanValue(
  value,
  fallback,
  context,
  optionName = "value",
) {
  if (value === undefined || value === null) {
    return fallback;
  }

  const evaluated = readValue(value, context);

  if (typeof evaluated === "boolean") {
    return evaluated;
  }

  console.warn(
    `[js-badge] ${optionName} must be a boolean or a JavaScript template that returns a boolean.`,
  );
  return fallback;
}

export function normalizeTextValue(value) {
  if (value === undefined || value === null || value === false) {
    return "";
  }

  return String(value);
}

export function escapeHtml(value) {
  return normalizeTextValue(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function decodeHtmlEntities(value, documentObject = globalThis.document) {
  const normalizedValue = normalizeTextValue(value);

  if (!normalizedValue.includes("&") || !documentObject?.createElement) {
    return normalizedValue;
  }

  const decoder = documentObject.createElement("textarea");
  decoder.innerHTML = normalizedValue;
  return decoder.value;
}

export function decodeAndEscapeHtml(value, documentObject = globalThis.document) {
  return escapeHtml(decodeHtmlEntities(value, documentObject));
}
