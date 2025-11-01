import * as PIXI from "pixi.js";
import { App } from "../system/App";
import Matter from "matter-js";
import { Diamond } from "./Diamond";

export class Platform {
    constructor(rows, cols, x) {
        this.rows = rows;
        this.cols = cols;

        this.tileSize = PIXI.Texture.from("tile").width;
        this.width = this.tileSize * this.cols;
        this.height = this.tileSize * this.rows;

        this.createContainer(x);
        this.createTiles();

        this.dx = App.config.platforms.moveSpeed;
        this.createBody();

        this.diamonds = [];
        this.createDiamonds();
    }

    get randomData() {
        this.ranges = App.config.platforms.ranges;
        let data = { rows: 0, cols: 0, x: 0 };

        const offset = this.ranges.offset.min
            + Math.round(Math.random() * (this.ranges.offset.max - this.ranges.offset.min));

        data.x = this.current.container.x + this.current.container.width + offset;
        data.cols = this.ranges.cols.min + Math.round(Math.random() * (this.ranges.cols.max - this.ranges.cols.min));
        data.rows = this.ranges.rows.min + Math.round(Math.random() * (this.ranges.rows.max - this.ranges.rows.min));

        return data;
    }
    createContainer(x) {
        this.container = new PIXI.Container();
        this.container.x = x;
        this.container.y = window.innerHeight - this.height;
    }
    createBody() {
        this.body = Matter.Bodies.rectangle(this.width / 2 + this.container.x,
            this.height / 2 + this.container.y, this.width, this.height, { friction: 0, isStatic: true });

        Matter.World.add(App.physics.world, this.body);
        this.body.gamePlatform = this;
    }
    createTiles() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.createTile(row, col);
            }
        }
    }
    createTile(row, col) {
        let texture = "";
        if(row === 0 && col !== 0 && col !== this.cols - 1) texture = "tile_02"
        else if (row === 0 && col === 0) texture = "tile_01"
        else if (row === 0 && col === this.cols - 1) texture = "tile_03"
        else if(col === 0) texture = "tile_11"
        else if(col === this.cols - 1) texture = "tile_13"
        else texture = "tile_12";
        const tile = App.sprite(texture);
        this.container.addChild(tile);
        tile.x = col * tile.width;
        tile.y = row * tile.height;
    }

    createDiamonds() {
        const y = App.config.diamonds.offset.min + Math.random() * (App.config.diamonds.offset.max - App.config.diamonds.offset.min);

        for (let i = 0; i < this.cols; i++) {
            if (Math.random() < App.config.diamonds.chance) {
                this.createDiamond(this.tileSize * i, -y);
            }
        }
    }
    createDiamond(x, y) {
            const diamond = new Diamond(x, y);
            this.container.addChild(diamond.sprite);
            diamond.createBody();
            this.diamonds.push(diamond);
    }
    move() {
        if (this.body) {
            Matter.Body.setPosition(this.body, { x: this.body.position.x + this.dx, y: this.body.position.y });
            this.container.x = this.body.position.x - this.width / 2;
            this.container.y = this.body.position.y - this.height / 2;
        }
    }
        destroy() {
        Matter.World.remove(App.physics.world, this.body);
        this.diamonds.forEach(diamond => diamond.destroy());
        this.container.destroy();
    }
}