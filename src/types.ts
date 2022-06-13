import { LovelaceCard, LovelaceCardEditor } from "custom-card-helpers";

declare global {
  interface HTMLElementTagNameMap {
    "fan-xiaomi-card-editor": LovelaceCardEditor;
    "hui-error-card": LovelaceCard;
  }
}
