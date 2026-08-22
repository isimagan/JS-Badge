# JS Badge

A customizable Home Assistant dashboard badge with JavaScript template support.

```yaml
type: custom:js-badge
```

## Features

- Works with or without an entity
- Automatically uses the entity name, state, icon and picture
- Supports JavaScript templates
- Supports tap, hold and double-tap actions
- Customizable text, colors and visibility

## Installation

1. Open HACS.
2. Select **Custom repositories**.
3. Add this repository as a **Dashboard** repository.
4. Install **JS Badge**.
5. Refresh Home Assistant.

## Basic usage

```yaml
badges:
  - type: custom:js-badge
    entity: sensor.example
```

By default, JS Badge displays the entity picture when available, otherwise the
entity icon, followed by the entity name and formatted state.

## Parameters

The JavaScript column shows whether the parameter supports
`[[[ return ... ]]]` templates.

| Parameter | Default | Description | JavaScript |
| --- | --- | --- | :---: |
| `entity` | Optional | Home Assistant entity ID | ❌ |
| `name` | Entity name | Smaller text | ✅ |
| `label` | Entity state | Main text | ✅ |
| `icon` | Automatic | Explicit Material Design icon | ✅ |
| `color` | Automatic | Icon color | ✅ |
| `background_color` | Theme color | Badge background | ✅ |
| `label_color` | Theme color | Main text color | ✅ |
| `name_color` | Theme color | Smaller text color | ✅ |
| `show_entity_picture` | `true` | Use the entity picture when available | ✅ |
| `show_icon` | `true` | Show the picture or icon | ✅ |
| `show_name` | `true` | Show the name | ✅ |
| `show_label` | `true` | Show the label | ✅ |
| `show_unit` | `true` | Show the unit of measurement | ✅ |
| `show_badge` | `true` | Show the entire badge | ✅ |
| `tap_action` | `more-info` | Action when tapped | ✅ |
| `hold_action` | `none` | Action when held | ✅ |
| `double_tap_action` | `none` | Action when double-tapped | ✅ |

## Entity picture and icon

Entity pictures are used automatically:

```yaml
type: custom:js-badge
entity: sensor.feel24_visitors
```

An explicitly configured icon takes priority:

```yaml
type: custom:js-badge
entity: sensor.feel24_visitors
icon: mdi:ab-testing
```

To use the entity icon instead of its picture:

```yaml
show_entity_picture: false
```

To hide the entire visual:

```yaml
show_icon: false
```

The visual priority is:

1. Configured `icon`
2. Entity picture
3. Entity icon

## Hide the unit

The entity's unit of measurement is shown by default. For example:

```text
4 visitors
```

Hide it with:

```yaml
show_unit: false
```

The badge will then display `4`.

## Custom text and colors

```yaml
type: custom:js-badge
entity: sensor.example
name: My sensor
label: Ready
icon: mdi:check
color: green
background_color: rgba(0, 128, 0, 0.12)
```

## JavaScript templates

Templates use triple brackets and must return a value.

```yaml
type: custom:js-badge
entity: sensor.battery
label: "[[[ return `${entity.state} %`; ]]]"
icon: "[[[ return Number(entity.state) < 20 ? 'mdi:battery-alert' : 'mdi:battery'; ]]]"
color: "[[[ return Number(entity.state) < 20 ? 'red' : 'green'; ]]]"
```

Available variables:

- `entity`
- `states`
- `hass`
- `config`
- `user`
- `helpers`

## Actions

```yaml
type: custom:js-badge
entity: light.living_room
tap_action:
  action: toggle
hold_action:
  action: more-info
double_tap_action:
  action: navigate
  navigation_path: /lovelace/lights
```

## Security

JavaScript templates run in your browser. Only use templates you trust.

## License

MIT
