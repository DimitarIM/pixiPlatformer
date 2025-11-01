import { Scene } from "../../system/Scene";
import { BackgroundLayer1 } from "../BackgroundLayer1";
import { BackgroundLayer2 } from "../BackgroundLayer2";
import { BackgroundLayer3 } from "../BackgroundLayer3";
import { BackgroundLayer4 } from "../BackgroundLayer4";
import { BackgroundLayer5 } from "../BackgroundLayer5";
import { BackgroundLayer6 } from "../BackgroundLayer6";
import { MainBackground } from "../MainBackground";
import { LabelScore } from "../LabelScore";
import { WinMessage } from "../WinMessage";
import { App } from "../../system/App";
import * as PIXI from "pixi.js";


export class Win extends Scene {
    create() {
        this.createMainBackground();
        this.createBackground();
        this.createUI();
        this.createCake();

        this.container.on("pointerdown", () => {
            App.app.ticker.remove(this.update, this);
            App.scenes.start("Game");
        });
    }

    createUI() {
        this.winMessage = new WinMessage();
        this.container.addChild(this.winMessage);
    }

    createMainBackground() {
        this.mainBG = new MainBackground();
        this.container.addChild(this.mainBG.container);
    }

    createCake() {
        const cakeFrames = [
            App.res("cake1"),
            App.res("cake2"),
            App.res("cake3"),
            App.res("cake4"),
            App.res("cake5"),
            App.res("cake6"),
            App.res("cake7"),
            App.res("cake8"),
        ]

        this.cakeSprite = new PIXI.AnimatedSprite(cakeFrames);

        this.cakeSprite.width = 300;
        this.cakeSprite.height = 300;

        this.cakeSprite.x = App.config.cake.position.x - this.cakeSprite.width / 2;
        this.cakeSprite.y = App.config.cake.position.y;

        this.cakeSprite.loop = true;
        this.cakeSprite.animationSpeed = 0.1;
        this.cakeSprite.play();
        this.container.addChild(this.cakeSprite);
    }

    createBackground() {
        this.bgLayer1 = new BackgroundLayer1();
        this.bgLayer2 = new BackgroundLayer2();
        this.bgLayer3 = new BackgroundLayer3();
        this.bgLayer4 = new BackgroundLayer4();
        this.bgLayer5 = new BackgroundLayer5();
        this.bgLayer6 = new BackgroundLayer6();
        this.container.addChild(this.bgLayer1.container);
        this.container.addChild(this.bgLayer2.container);
        this.container.addChild(this.bgLayer3.container);
        this.container.addChild(this.bgLayer4.container);
        this.container.addChild(this.bgLayer5.container);
        this.container.addChild(this.bgLayer6.container);
    }
    update(dt) {
        this.bgLayer1.update(dt);
        this.bgLayer2.update(dt);
        this.bgLayer3.update(dt);
        this.bgLayer4.update(dt);
        this.bgLayer5.update(dt);
        this.bgLayer6.update(dt);
    }

    destroy() {
        App.app.ticker.remove(this.update, this);
        this.bgLayer1.destroy();
        this.bgLayer2.destroy();
        this.bgLayer3.destroy();
        this.bgLayer4.destroy();
        this.bgLayer5.destroy();
        this.bgLayer6.destroy();
        this.winMessage.destroy();
    }
}