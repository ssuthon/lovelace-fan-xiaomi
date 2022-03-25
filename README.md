# Xiaomi Fan Lovelace Card

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/custom-components/hacs)

Xiaomi Smartmi Fan Lovelace card for HASS/Home Assistant.

## Features

- Supports [HACS](https://github.com/custom-components/hacs) installation
- CSS fan blade and oscillation animation
- UI config of card
- Wide range of fans support by using HA standard speeds flag

### Toggles

- Oscillation
- Natural mode
- Child lock
- Sleep mode

### Cycling

- Speed level
- Oscillation angle
- Timer duration

## Requirements

By default, the **Xiaomi Miio** native integration will be used.

If you have a model that's not supported by the native integration yet, this card also supports the [Xiaomi Mi Smart Pedestal Fan](https://github.com/syssi/xiaomi_fan) integration.

## HACS Installation

Search for `Xiaomi Smartmi Fan Card`

## Manual Installation

1. Download `fan-xiaomi.js`
1. Copy to `www/community/lovelace-fan-xiaomi/fan-xiaomi.js`
1. Add the following to your Lovelace resources
   ```yaml
   resources:
     - url: /community_plugin/lovelace-fan-xiaomi/fan-xiaomi.js
       type: js
   ```

## Card Configuration

Example of Lovelace config `views.cards` key

```yaml
entity: fan.entity_id
name: Fan Name
type: "custom:fan-xiaomi"
platform: xiaomi_miio_airpurifier
```

| Card attribute             | Default   | Description                                                                                          |
| -------------------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| `entity_id`                | -         | `entity_id` of your fan                                                                              |
| `type`                     | -         | Must be `custom:fan-xiaomi`                                                                          |
| `name`                     | -         | (Optional) Fan name shown on card title                                                              |
| `platform`                 | `default` | (Optional) If using Xiaomi Mi Smart Pedestal Fan integration, specify `xiaomi_miio_fan`.             |
| `disable_animation`        | `False`   | (Optional) Disable fan image and animation                                                           |
| `use_standard_speeds`      | `False`   | (Optional) Use `low`/`medium`/`high` speeds, if you have issues using this card with your fan model. |
| `force_sleep_mode_support` | `False`   | (Optional) Enables Sleep button in UI which sets speed to 1%                                         |
| `hide_led_button`          | `False`   | (Optional) Hide LED toggle for supported models                                                      |

## Preview

![](preview.gif)

## Contributing

1. Clone the repo and install the latest node LTS
1. Run `npm install` then `npm run build` from the root of the repo

Build output should appear in the `/dist` directory.

### Development Inner Loop

1. `npm install`
1. Run `npm run start` to do a watch build and host the built files at `http://127.0.0.1:5000/xiaomi-fan-card.js`.
1. On a running Home Assistant installation add this to your Lovelace
   `resources:`

```yaml
- url: "http://127.0.0.1:5000/xiaomi-fan-card.js"
  type: module
```

_You may need to change "127.0.0.1" to the IP of your development machine if you are developing remotely._

## Credits

[fineemb](https://github.com/fineemb) (Original author)

[shaonianzhentan](https://github.com/shaonianzhentan/)

[花神](https://github.com/yaming116)
