import { applyBadgeStyles } from "./badge-styles.js";
import { BADGE_STYLES } from "./styles.js";
import { decodeAndEscapeHtml } from "./value-helpers.js";

function createTextMarkup(model) {
  const secondaryMarkup =
    model.showSecondary && model.secondary
      ? `<span class="label">${decodeAndEscapeHtml(model.secondary)}</span>`
      : "";

  const primaryMarkup =
    model.showPrimary && model.primary
      ? `<span class="content">${decodeAndEscapeHtml(model.primary)}</span>`
      : "";

  if (!secondaryMarkup && !primaryMarkup) {
    return "";
  }

  return `<span class="info">${secondaryMarkup}${primaryMarkup}</span>`;
}

export function appendBadgeVisual(iconContainer, model, hass) {
  if (model.entityPicture) {
    const pictureElement = document.createElement("img");
    pictureElement.className = "entity-picture";
    pictureElement.setAttribute("src", model.entityPicture);
    pictureElement.setAttribute("alt", "");
    pictureElement.setAttribute("aria-hidden", "true");
    iconContainer.appendChild(pictureElement);
    return;
  }

  if (model.icon) {
    const iconElement = document.createElement("ha-icon");
    iconElement.setAttribute("icon", model.icon);
    iconContainer.appendChild(iconElement);
    return;
  }

  if (model.stateObject) {
    const stateIconElement = document.createElement("ha-state-icon");
    stateIconElement.hass = hass;
    stateIconElement.stateObj = model.stateObject;
    iconContainer.appendChild(stateIconElement);
    return;
  }

  iconContainer.remove();
}

export function renderBadge(shadowRoot, model, hass) {
  const textMarkup = createTextMarkup(model);

  shadowRoot.innerHTML = `
    <style>${BADGE_STYLES}</style>
    <div class="badge${textMarkup ? "" : " icon-only"}">
      <span class="icon"></span>
      ${textMarkup}
    </div>
  `;

  const badge = shadowRoot.querySelector(".badge");
  if (!badge) {
    return undefined;
  }

  applyBadgeStyles(badge, model.styleVariables);

  const iconContainer = shadowRoot.querySelector(".icon");
  if (!iconContainer) {
    return badge;
  }

  if (!model.showIcon) {
    iconContainer.remove();
    return badge;
  }

  appendBadgeVisual(iconContainer, model, hass);
  return badge;
}
