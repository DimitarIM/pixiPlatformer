import * as PIXI from "pixi.js";
import { App } from "../system/App";
import * as Matter from 'matter-js';
import { AttackBox } from "./AttackBox";

export class Hero {
    constructor() {
        this.walkFrames = [
            App.res("kangaroo-walk1"),
            App.res("kangaroo-walk2"),
            App.res("kangaroo-walk3"),
            App.res("kangaroo-walk2"),
        ];
        this.jumpFrames = App.res("kangaroo-walk3");
        this.attackFrames = [
            App.res("kangaroo-fist1"),
            App.res("kangaroo-fist2"),
            App.res("kangaroo-fist3"),
            App.res("kangaroo-fist4"),
            App.res("kangaroo-fist3"),
            App.res("kangaroo-fist2"),
        ]

        this.createContainer();
        this.createSprite();
        this.createBody();

        App.app.ticker.add(this.update, this);
        this.dy = App.config.hero.jumpSpeed;
        this.maxJumps = App.config.hero.maxJumps;
        this.jumpIndex = 0;
        this.score = 0;
        this.isOnPlatform = false;
        this.isTriggered = false;
        this.prevTextures = this.walkFrames;

        this.offsetX = this.sprite.width / 2;  // in front of hero
        this.offsetY = this.sprite.height / 2 - 50;
    }
    collectDiamond(diamond) {
        ++this.score;
        if (this.score >= 10 ) {
            console.log("meow"); 
            App.app.ticker.remove(this.update, this);
            this.score = 0;
            App.scenes.start("Win");
        }

        Matter.World.remove(App.physics.world, diamond.body);

        if (diamond.sprite) {
            diamond.sprite.destroy();
            diamond.sprite = null;
        }

        this.sprite.emit("score");
    }

    createBody() {
        this.body = Matter.Bodies.rectangle(this.sprite.x + this.sprite.width / 2, this.sprite.y + this.sprite.height / 2, this.sprite.width, this.sprite.height, { friction: 0 });
        Matter.World.addBody(App.physics.world, this.body);
        this.body.gameHero = this;
    }

    createSprite() {
        this.sprite = new PIXI.AnimatedSprite(this.walkFrames);

        this.sprite.x = App.config.hero.position.x;
        this.sprite.y = App.config.hero.position.y;
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();
    }

    startJump() {
        if (this.platform || this.jumpIndex === 1) {
            ++this.jumpIndex;
            this.platform = null;
            this.isOnPlatform = true;
            this.isTriggered = false;
            console.log("jumped");
            this.sprite.textures = [this.jumpFrames];
            Matter.Body.setVelocity(this.body, { x: 0, y: -this.dy });
        }
    }

    createContainer() {
        this.container = new PIXI.Container();
        this.container.x = window.innerWidth - this.x;
        this.container.y = window.innerHeight - this.height;
    }

    attack() {
        console.log("attacked");
        this.prevTextures = !this.isOnPlatform ? [this.jumpFrames] : this.walkFrames;
        this.sprite.textures = this.attackFrames;
        this.sprite.loop = false;
        this.sprite.animationSpeed = 0.6;
        this.sprite.gotoAndPlay(0);
        this.createAttackHitBox();

        this.sprite.onComplete = () => {
            this.sprite.textures = this.prevTextures;
            this.sprite.loop = true;
            this.sprite.animationSpeed = 0.1;
            this.sprite.play();
        }

    }

    createAttackHitBox() {
        const attackBox = new AttackBox(50, 80);

        App.app.stage.addChild(attackBox.sprite);

        attackBox.sprite.x = this.sprite.x + this.offsetX;
        attackBox.sprite.y = this.sprite.y + this.offsetY;

        attackBox.createBody(this.sprite.x + this.offsetX, this.sprite.y + this.offsetY);

        this.attackBox = attackBox;

        setTimeout(() => {
            attackBox.destroy();
            this.attackBox = undefined;
        }, attackBox.duration);
    }

    stayOnPlatform(platform) {
        this.isOnPlatform = true;
        if (this.isOnPlatform && !this.isTriggered) {
            this.isTriggered = true;
            this.sprite.textures = this.walkFrames;
            this.sprite.loop = true;
            this.sprite.animationSpeed = 0.1;
            this.sprite.play();
        }
        this.platform = platform;
        this.jumpIndex = 0;
    }

    update() {
        this.sprite.x = this.body.position.x - this.sprite.width / 2;
        this.sprite.y = this.body.position.y - this.sprite.height / 2;

        if (this.attackBox) {
            this.attackBox.sprite.x = this.sprite.x + this.offsetX;
            this.attackBox.sprite.y = this.sprite.y + this.offsetY;
        }

        if (this.sprite.y > window.innerHeight) {
            this.sprite.emit("die");
        }
    }

    destroy() {
        App.app.ticker.remove(this.update, this);
        Matter.World.add(App.physics.world, this.body);
        this.sprite.destroy();
    }
}