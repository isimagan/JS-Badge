import {
  JS_BADGE_NAME,
  JS_BADGE_TYPE,
} from "./constants.js";

export function registerJsBadge() {
  window.customBadges = window.customBadges || [];

  const definition = {
    type: JS_BADGE_TYPE,
    name: JS_BADGE_NAME,
    preview: false,
    description: "A customizable badge with JavaScript template support.",
  };

  const existingIndex = window.customBadges.findIndex(
    (badge) => badge.type === JS_BADGE_TYPE,
  );

  if (existingIndex >= 0) {
    window.customBadges[existingIndex] = definition;
  } else {
    window.customBadges.push(definition);
  }
}
