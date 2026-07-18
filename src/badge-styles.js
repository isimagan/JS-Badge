import { DEFAULT_STYLES } from "./constants.js";
import { readStyleValue } from "./value-helpers.js";

export function getBadgeStyleVariables(config, context) {
  return {
    "--js-badge-icon-color": readStyleValue(
      config.icon_color ?? config.color,
      DEFAULT_STYLES.iconColor,
      context,
    ),
    "--js-badge-background-color": readStyleValue(
      config.background_color,
      DEFAULT_STYLES.backgroundColor,
      context,
    ),
    "--js-badge-primary-color": readStyleValue(
      config.primary_color ?? config.label_color,
      DEFAULT_STYLES.primaryColor,
      context,
    ),
    "--js-badge-secondary-color": readStyleValue(
      config.secondary_color ?? config.name_color,
      DEFAULT_STYLES.secondaryColor,
      context,
    ),
  };
}

export function applyBadgeStyles(badge, styleVariables) {
  for (const [property, value] of Object.entries(styleVariables)) {
    badge.style.setProperty(property, value);
  }
}
