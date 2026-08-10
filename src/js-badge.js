import { createBadgeModel } from "./badge-model.js";
import { renderBadge } from "./badge-renderer.js";
import { BadgeInteractions } from "./interactions.js";

export class JsBadge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = undefined;
    this._interactions = new BadgeInteractions(this);
    this.connectedWhileHidden = true;
  }

  connectedCallback() {
    this._render();
  }

  setConfig(config) {
    if (!config || typeof config !== "object") {
      throw new Error("JS Badge requires a configuration object.");
    }

    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _isEditorPreview() {
    return (
      this.parentElement?.preview === true ||
      Boolean(this.closest?.("hui-badge-edit-mode"))
    );
  }

  _setBadgeVisibility(showBadge) {
    const visible = showBadge || this._isEditorPreview();
    const wasHidden = this.hidden;

    this.hidden = !visible;

    if (wasHidden !== this.hidden) {
      this.dispatchEvent(
        new CustomEvent("badge-visibility-changed", {
          bubbles: true,
          composed: true,
          detail: { value: visible },
        }),
      );
    }

    return visible;
  }

  _render() {
    if (!this.shadowRoot) {
      return;
    }

    const model = createBadgeModel(this._config, this._hass);
    const visible = this._setBadgeVisibility(model.showBadge);

    if (!visible) {
      this.shadowRoot.replaceChildren();
      return;
    }

    const badge = renderBadge(this.shadowRoot, model, this._hass);

    if (!badge) {
      return;
    }

    this._interactions.update(this._hass, this._config);
    this._interactions.bind(badge);
  }

  static getStubConfig() {
    return {
      entity: "sun.sun",
    };
  }
}
