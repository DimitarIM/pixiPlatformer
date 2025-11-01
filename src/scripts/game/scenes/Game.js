import Matter from "matter-js";
import { Scene } from "../../system/Scene";
import { BackgroundLayer1 } from "../BackgroundLayer1";
import { BackgroundLayer2 } from "../BackgroundLayer2";
import { BackgroundLayer3 } from "../BackgroundLayer3";
import { BackgroundLayer4 } from "../BackgroundLayer4";
import { BackgroundLayer5 } from "../BackgroundLayer5";
import { BackgroundLayer6 } from "../BackgroundLayer6";
import { Hero } from "../Hero";
import { Platforms } from "../Platforms";
import { App } from "../../system/App";
import { LabelScore } from "../LabelScore";
import { MainBackground } from "../MainBackground";

export class Game extends Scene {
    create() {
        this.createMainBackground();
        this.createBackground();
        this.createHero();
        this.createPlatforms();
        this.setEvents();
        this.createUI();
    }

    createUI() {
        this.labelScore = new LabelScore();
        this.container.addChild(this.labelScore);
        this.hero.sprite.on("score", () => {
            this.labelScore.renderScore(this.hero.score);
        });
    }

    setEvents() {
        Matter.Events.on(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
    }

    onCollisionStart(event) {
    for (const pair of event.pairs) {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;

        const hero = [bodyA, bodyB].find(b => b.gameHero);
        const attackBox = [bodyA, bodyB].find(b => b.gameAttackBox);
        const platform = [bodyA, bodyB].find(b => b.gamePlatform);
        const diamond = [bodyA, bodyB].find(b => b.gameDiamond);

        if (hero && platform) {
            this.hero.stayOnPlatform(platform.gamePlatform);
        }

        // if (hero && diamond) {
        //     this.hero.sprite.emit("die");
        // }


        if (attackBox && diamond) {
            console.log(attackBox); 
            this.hero.collectDiamond(diamond.gameDiamond);
        }

        
    }
    }

    createHero() {
        this.hero = new Hero();
        this.container.interactive = true;
        this.container.on("pointerdown", () => {
            this.hero.attack();
        });
        window.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                this.hero.startJump();
            }
        })
        this.container.addChild(this.hero.sprite);

        this.hero.sprite.once("die", () => {
            App.scenes.start("Game");
        });
    }

    createPlatforms() {
        this.platforms = new Platforms();
        this.container.addChild(this.platforms.container);
    }

    createMainBackground() {
        this.mainBG = new MainBackground();
        this.container.addChild(this.mainBG.container);
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
        this.platforms.update(dt);
    }

    destroy() {
        Matter.Events.off(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
        App.app.ticker.remove(this.update, this);
        this.bgLayer1.destroy();
        this.bgLayer2.destroy();
        this.bgLayer3.destroy();
        this.bgLayer4.destroy();
        this.bgLayer5.destroy();
        this.bgLayer6.destroy();
        this.hero.destroy();
        this.platforms.destroy();
        this.labelScore.destroy();
    }
}