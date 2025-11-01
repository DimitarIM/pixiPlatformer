import * as PIXI from "pixi.js";
import { App } from "../system/App";

export class MainBackground {
    constructor() {
        this.container = new PIXI.Container();
        this.createSprite();
    }

    createSprite() {
        const sprite = App.sprite("1");
        sprite.x = 0;
        sprite.y = 0;
        sprite.width = window.innerWidth;
        sprite.height = window.innerHeight;
        this.container.addChild(sprite);
    }

    destroy() {
        this.container.destroy();
    }
}