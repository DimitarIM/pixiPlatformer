import { App } from "../system/App";
import Matter from "matter-js";
import * as PIXI from "pixi.js";

export class AttackBox {
    constructor(width, height , duration = 200) {
        this.width = width;
        this.height = height;
        this.duration = duration;

        this.createSprite();
    }

    createSprite() {
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0xff0000, 0);
        this.sprite.drawRect(0, 0, this.width, this.height);
        this.sprite.endFill();
    }

    createBody(x, y) {
            this.body = Matter.Bodies.rectangle(x + this.width / 2,
                 y + this.height / 2,
                 this.width,
                 this.height,
                { isSensor: true, isStatic: false });
            this.body.gameAttackBox = this;
            Matter.World.add(App.physics.world, this.body);
        }
destroy() {
        if (this.sprite.parent) this.sprite.destroy();
        Matter.World.remove(App.physics.world, this.body);
}
}