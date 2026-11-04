import { formatEntityState, getStateObject } from "./entity-state.js";
import { getBadgeStyleVariables } from "./badge-styles.js";
import {
  normalizeTextValue,
  readBooleanValue,
  readStrictBooleanValue,
  readValue,
} from "./value-helpers.js";

function createContext(config, hass, stateObject) {
  return { config, hass, stateObject };
}

function getLabel(config, hass, stateObject, showUnit, read) {
  const value = config.label;

  if (value !== undefined) {
    return read(value);
  }

  return formatEntityState(config, hass, stateObject, showUnit);
}

function getName(config, hass, stateObject, read) {
  const value =
    config.name ??
    (stateObject ? hass?.formatEntityName?.(stateObject) : undefined) ??
    stateObject?.attributes?.friendly_name ??
    config.entity ??
    "";

  return read(value);
}

function getIcon(config, stateObject, read) {
  const value = config.icon ?? stateObject?.attributes?.icon ?? "";
  return read(value);
}

function hasConfiguredIcon(config) {
  return config.icon !== undefined && config.icon !== null;
}

export function createBadgeModel(config, hass) {
  const stateObject = getStateObject(config, hass);
  const context = createContext(config, hass, stateObject);
  const read = (value) => readValue(value, context);
  const showEntityPicture = readBooleanValue(
    config.show_entity_picture,
    true,
    context,
  );
  const showUnit = readBooleanValue(config.show_unit, true, context);

  return {
    stateObject,
    showBadge: readStrictBooleanValue(
      config.show_badge,
      true,
      context,
      "show_badge",
    ),
    label: normalizeTextValue(
      getLabel(config, hass, stateObject, showUnit, read),
    ),
    name: normalizeTextValue(getName(config, hass, stateObject, read)),
    icon: normalizeTextValue(getIcon(config, stateObject, read)),
    entityPicture: normalizeTextValue(
      !hasConfiguredIcon(config) && showEntityPicture
        ? stateObject?.attributes?.entity_picture
        : "",
    ),
    showIcon: readBooleanValue(config.show_icon, true, context),
    showLabel: readBooleanValue(config.show_label, true, context),
    showName: readBooleanValue(config.show_name, true, context),
    styleVariables: getBadgeStyleVariables(config, context),
  };
}
