export function getStateObject(config, hass) {
  if (!config?.entity || !hass?.states) {
    return undefined;
  }

  return hass.states[config.entity];
}

export function formatEntityState(
  config,
  hass,
  stateObject,
  showUnit = config.show_unit !== false,
) {
  if (!stateObject) {
    return config.entity ? "Entity not found" : "";
  }

  const state = stateObject.state ?? "";
  const unit = stateObject.attributes?.unit_of_measurement;

  if (!showUnit && unit) {
    return state;
  }

  if (hass?.formatEntityState) {
    return hass.formatEntityState(stateObject);
  }

  return unit ? `${state} ${unit}` : state;
}
