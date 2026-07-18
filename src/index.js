import { JsBadge } from "./js-badge.js";
import {
  JS_BADGE_NAME,
  JS_BADGE_TYPE,
  JS_BADGE_VERSION,
} from "./constants.js";
import { registerJsBadge } from "./register.js";

if (!customElements.get(JS_BADGE_TYPE)) {
  customElements.define(JS_BADGE_TYPE, JsBadge);
}

registerJsBadge();
setTimeout(registerJsBadge, 0);
setTimeout(registerJsBadge, 1000);

console.info(
  `%c${JS_BADGE_NAME} ${JS_BADGE_VERSION}`,
  "color: var(--primary-color); font-weight: bold;",
);
