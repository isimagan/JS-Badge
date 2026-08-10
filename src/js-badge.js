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
    this._editorContextObserver = undefined;
    this._editorPreview = false;
  }

  connectedCallback() {
    this._observeEditorContext();
    this._render();
  }

  disconnectedCallback() {
    this._editorContextObserver?.disconnect();
    this._editorContextObserver = undefined;
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

  _observeEditorContext() {
    this._editorContextObserver?.disconnect();

    const root = this.getRootNode?.();
    if (!root || typeof MutationObserver === "undefined") {
      return;
    }

    this._editorContextObserver = new MutationObserver(() => {
      const editorPreview = this._isEditorPreview();

      if (editorPreview !== this._editorPreview) {
        this._render();
      }
    });
    this._editorContextObserver.observe(root, {
      childList: true,
      subtree: true,
    });
  }

  _setBadgeVisibility(showBadge) {
    const editorPreview = this._isEditorPreview();
    const visible = showBadge || editorPreview;
    const wasHidden = this.hidden;

    this._editorPreview = editorPreview;
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
