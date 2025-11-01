import * as PIXI from "pixi.js";
import * as Matter from "matter-js";
import { ScenesManager } from "./SceneManager";
import { Loader } from "./Loader";

class Application {
    run(config) {
        this.config = config;
        this.app = new PIXI.Application({ resizeTo: window });
        document.body.appendChild(this.app.view);

        this.loader = new Loader(this.app.loader, this.config);
        this.loader.preload().then((() => this.start()));

        this.scenes = new ScenesManager();
        this.app.stage.interactive = true;
        this.app.stage.addChild(this.scenes.container);

        this.createPhysics();
    }
    start() {
        this.scenes.start("Game");
    }
    res(key) {
        return this.loader.resources[key].texture;
    }
    sprite(key) {
        return new PIXI.Sprite(this.res(key));
    }

    createPhysics(){
        this.physics = Matter.Engine.create();
        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, this.physics);
    }
    addFont(){

    }
}

export const App = new Application();