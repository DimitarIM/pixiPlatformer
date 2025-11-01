import * as PIXI from "pixi.js";
import { App } from "../system/App";

export class WinMessage extends PIXI.Text {
    constructor() {
        super();
        this.x = App.config.winMessage.x;
        this.y = App.config.winMessage.y;
        this.anchor.set(App.config.winMessage.anchor);
        this.style = App.config.winMessage.style;
        this.renderMessage();
    }

    renderMessage() {
        this.text = `Happy Birthday!`;
    }
}