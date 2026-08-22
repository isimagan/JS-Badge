# JS Badge

JS Badge is a customizable Home Assistant dashboard badge with JavaScript template support.

```yaml
type: custom:js-badge
```

The project contains one badge type. Source code is split into modules under `src/`, while HACS installs the generated bundle from `dist/js-badge.js`.

The source is organized by responsibility: badge state/model, visibility, styling, rendering, interactions, actions and template evaluation.

## Project structure

```text
src/
├── actions.js
├── badge-model.js
├── badge-renderer.js
├── badge-styles.js
├── badge-visibility.js
├── constants.js
├── js-badge.js
├── entity-state.js
├── index.js
├── interactions.js
├── register.js
├── styles.js
├── template.js
└── value-helpers.js
```

`src/js-badge.js` only handles the custom element lifecycle and coordinates the other modules.


## Features

- Optional Home Assistant entity
- Entity name, formatted state and entity icon as defaults
- Automatic entity picture support with entity icon fallback
- Custom name, label, icon, colors and layout
- JavaScript templates using `[[[ return ... ]]]`
- Tap, hold and double-tap actions
- Sequential multi-actions and delays
- Service calls using `perform-action`, `call-service` or `call_service`
- Handling for missing, `unknown` and `unavailable` entities
- Optional hiding when an entity is missing, unknown or unavailable
- Boolean or JavaScript-controlled visibility for the entire badge

## Installation with HACS

Until the repository is published in the default HACS store:

1. Open HACS.
2. Open the three-dot menu.
3. Select **Custom repositories**.
4. Add this repository URL.
5. Select **Dashboard** as the category.
6. Install **JS Badge**.
7. Refresh Home Assistant in the browser.

HACS installs this file:

```text
dist/js-badge.js
```

## Basic usage

```yaml
badges:
  - type: custom:js-badge
    entity: sensor.robotvacuum_battery
```

By default, the badge uses the entity's:

- friendly name as the name
- formatted state as the label
- state icon as the icon

The formatted state includes the entity's unit of measurement by default. Set
`show_unit: false` to hide it:

```yaml
badges:
  - type: custom:js-badge
    entity: sensor.feel24_visitors
    show_unit: false
```

For example, `4 visitors` is then displayed as `4`.

## Custom text and icon

```yaml
badges:
  - type: custom:js-badge
    entity: sensor.robotvacuum_battery
    name: Robot vacuum
    label: Battery
    icon: mdi:robot-vacuum
```

`primary` and `secondary` can be used as aliases:

```text
name = primary
label = secondary
color = icon_color
```

## Entity pictures and icons

If the entity has an `entity_picture`, the badge uses it automatically. An
explicitly configured `icon` takes priority over the entity picture:

```yaml
badges:
  - type: custom:js-badge
    entity: sensor.feel24_visitors
    icon: mdi:ab-testing
```

Set `show_entity_picture: false` to use the entity's standard icon instead:

```yaml
badges:
  - type: custom:js-badge
    entity: sensor.feel24_visitors
    show_entity_picture: false
```

The visual priority is an explicitly configured `icon`, then the entity
picture, then the entity's standard icon. `show_icon: false` hides all three.

## Usage without an entity

```yaml
badges:
  - type: custom:js-badge
    name: Manual badge
    label: Works without an entity
    icon: mdi:test-tube
```

## JavaScript templates

Templates use triple brackets and must return a value.

```yaml
badges:
  - type: custom:js-badge
    entity: sensor.robotvacuum_battery
    name: "[[[ return 'Robot vacuum'; ]]]"
    label: "[[[ return `${entity.state} %`; ]]]"
    icon: "[[[ return Number(entity.state) < 30 ? 'mdi:battery-alert' : 'mdi:robot-vacuum'; ]]]"
```

HTML entities in returned text are supported for compatibility with custom
cards that use them as separators. HTML elements are still displayed as text.

```yaml
label: "[[[ return `On &middot; Ready`; ]]]"
```

### Template variables

| Variable | Description |
| --- | --- |
| `hass` | Full Home Assistant object |
| `entity` | Configured entity state object |
| `states` | All Home Assistant states |
| `config` | Badge configuration |
| `user` | Current Home Assistant user |
| `helpers` | Helper functions |

### Helpers

```js
helpers.state("sensor.example")
helpers.attr("sensor.example", "friendly_name")
helpers.hasEntity("sensor.example")
```

## Actions

If an entity is configured and `tap_action` is omitted, tapping opens more info.

```yaml
badges:
  - type: custom:js-badge
    entity: light.living_room
    name: Living room
    tap_action:
      action: more-info
    hold_action:
      action: toggle
    double_tap_action:
      action: navigate
      navigation_path: /lovelace/lights
```

## Multi-actions

Use `multi-actions` or `multi-action` and provide `actions` or `sequence`.

```yaml
badges:
  - type: custom:js-badge
    entity: light.living_room
    name: Living room
    tap_action:
      action: multi-actions
      actions:
        - action: perform-action
          perform_action: light.turn_on
          target:
            entity_id: light.living_room
          data:
            brightness_pct: 50

        - delay: 500ms

        - action: navigate
          navigation_path: /lovelace/lights
```

Supported delay formats:

```yaml
- delay: 500
- delay: 500ms
- delay: 1s
```

## Colors

```yaml
badges:
  - type: custom:js-badge
    entity: sensor.robotvacuum_battery
    icon_color: orange
    background_color: rgba(255, 165, 0, 0.12)
    primary_color: var(--primary-text-color)
    secondary_color: var(--secondary-text-color)
```

Colors can also use JavaScript templates.

## Visibility

Parts of the badge can be hidden:

```yaml
show_icon: false
show_primary: false
show_secondary: false
```

The entire badge can be hidden with `show_badge`. It defaults to `true` and
accepts either a boolean or a JavaScript template that returns a boolean:

```yaml
badges:
  - type: custom:js-badge
    entity: light.example
    show_badge: '[[[ return entity.state === "on"; ]]]'
```

In this example, the badge is only visible while `light.example` is on.
`show_badge` is available in the YAML/code editor but is not added to new badge
configurations automatically. A hidden badge remains visible while the
dashboard is in edit mode, so it can still be selected and configured.

## Options

Add these options in Home Assistant's YAML/code editor for the badge.

| Option | Default | Description |
| --- | --- | --- |
| `entity` | optional | Home Assistant entity ID |
| `primary` / `label` | formatted entity state | Main state/value line |
| `secondary` / `name` | entity friendly name | Smaller name line |
| `icon` | entity icon | Material Design icon |
| `icon_color` / `color` | state icon color | Icon color |
| `background_color` | card background | Badge background |
| `primary_color` / `label_color` | primary text color | Main text color |
| `secondary_color` / `name_color` | secondary text color | Smaller text color |
| `show_badge` | `true` | Show the entire badge; accepts a boolean or JavaScript returning a boolean |
| `show_icon` | `true` | Show icon |
| `show_entity_picture` | `true` | Use the entity picture when available and no explicit `icon` is configured |
| `show_primary` / `show_label` | `true` | Show main text |
| `show_secondary` / `show_name` | `true` | Show smaller text |
| `show_unit` | `true` | Show the entity's unit of measurement in the default state value |
| `tap_action` | `more-info` with entity | Tap action |
| `hold_action` | `none` | Hold action |
| `double_tap_action` | `none` | Double-tap action |

## Development

Install dependencies:

```bash
npm install
```

Build the HACS bundle:

```bash
npm run build
```

Watch source files while developing:

```bash
npm run watch
```

Repository structure:

```text
js-badge/
├── src/
│   ├── actions.js
│   ├── constants.js
│   ├── js-badge.js
│   ├── index.js
│   ├── register.js
│   ├── styles.js
│   └── value-helpers.js
├── dist/
│   └── js-badge.js
├── CHANGELOG.md
├── README.md
├── hacs.json
├── package.json
└── package-lock.json
```

`src/` is the editable source. Commit the generated `dist/js-badge.js` so HACS can install it.

## Security

JavaScript templates run in the browser. Only use templates you trust and understand.

## License

MIT
