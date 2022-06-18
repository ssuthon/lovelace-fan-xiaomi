/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, CSSResultGroup } from "lit";
import { HomeAssistant, fireEvent, LovelaceCardEditor } from "custom-card-helpers";

import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";
import { defaultConfig, FanXiaomiCardConfig, platforms } from "./config";
import { customElement, property, state } from "lit/decorators";
import { formfieldDefinition } from "../elements/formfield";
import { selectDefinition } from "../elements/select";
import { switchDefinition } from "../elements/switch";
import { textfieldDefinition } from "../elements/textfield";

@customElement("fan-xiaomi-card-editor")
export class FanXiaomiCardEditor extends ScopedRegistryHost(LitElement) implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private config!: Partial<FanXiaomiCardConfig>;

  @state() private helpers?: any;

  private isInitialized = false;

  static elementDefinitions = {
    ...textfieldDefinition,
    ...selectDefinition,
    ...switchDefinition,
    ...formfieldDefinition,
  };

  public setConfig(config: FanXiaomiCardConfig): void {
    this.config = config;

    this.loadCardHelpers();
  }

  protected shouldUpdate(): boolean {
    if (!this.isInitialized) {
      this._initialize();
    }

    return true;
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this.helpers) {
      return html``;
    }

    const config = {
      ...defaultConfig,
      ...this.config,
    };

    // You can restrict on domain type
    const entities = Object.keys(this.hass.states).filter((entity) => entity.startsWith("fan."));

    return html`
      <mwc-textfield
        label="Name (Optional)"
        .value=${config.name}
        .configValue=${"name"}
        @input=${this._valueChanged}
      ></mwc-textfield>
      <mwc-select
        naturalMenuWidth
        fixedMenuPosition
        label="Platform (Required)"
        .configValue=${"platform"}
        .value=${config.platform}
        @selected=${this._valueChanged}
        @closed=${(ev) => ev.stopPropagation()}
      >
        ${platforms.map((entity) => {
          return html`<mwc-list-item .value=${entity}>${entity}</mwc-list-item>`;
        })}
      </mwc-select>
      <mwc-select
        naturalMenuWidth
        fixedMenuPosition
        label="Entity (Required)"
        .configValue=${"entity"}
        .value=${config.entity}
        @selected=${this._valueChanged}
        @closed=${(ev) => ev.stopPropagation()}
      >
        ${entities.map((entity) => {
          return html`<mwc-list-item .value=${entity}>${entity}</mwc-list-item>`;
        })}
      </mwc-select>
      <mwc-formfield label="Show sleep mode button">
        <mwc-switch
          .checked=${config.force_sleep_mode_support}
          .configValue=${"force_sleep_mode_support"}
          @change=${this._valueChanged}
        ></mwc-switch>
      </mwc-formfield>
      <mwc-formfield label="Hide LED button (for supported devices)">
        <mwc-switch
          .checked=${config.hide_led_button}
          .configValue=${"hide_led_button"}
          @change=${this._valueChanged}
        ></mwc-switch>
      </mwc-formfield>
    `;
  }

  private _initialize(): void {
    if (this.hass === undefined) return;
    if (this.config === undefined) return;
    if (this.helpers === undefined) return;
    this.isInitialized = true;
  }

  private async loadCardHelpers(): Promise<void> {
    this.helpers = await (window as any).loadCardHelpers();
  }

  private _valueChanged(ev): void {
    if (!this.config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (target.configValue) {
      const newValue = target.checked !== undefined ? target.checked : target.value;
      if (defaultConfig[target.configValue] === newValue) {
        // To keep the yaml clean, if they are using default config, exclude it from the saved config.
        const tmpConfig = { ...this.config };
        delete tmpConfig[target.configValue];
        this.config = tmpConfig;
      } else {
        this.config = {
          ...this.config,
          [target.configValue]: newValue,
        };
      }
    }

    fireEvent(this, "config-changed", { config: this.config });
  }

  static styles: CSSResultGroup = css`
    mwc-select,
    mwc-textfield {
      margin-bottom: 16px;
      display: block;
    }
    mwc-formfield {
      padding-bottom: 8px;
      display: block;
    }
    mwc-switch {
      --mdc-theme-secondary: var(--switch-checked-color);
      --mdc-theme-surface: var(--switch-unchecked-button-color);
    }
  `;
}
