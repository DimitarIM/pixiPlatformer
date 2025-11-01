import { Tools } from "../system/Tools";
import { Game } from "./scenes/Game";
import { Win } from "./scenes/Win";


export const Config = {
    bg1Speed: 0.2,
    bg2Speed: 0.5,
    bg3Speed: 0.7,
    bg4Speed: 0.9,
    bg5Speed: 2,
    winMessage: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2 - 100,
        anchor: 0.5,
        style: {
            fontFamily: "VT323",
            fontSize: 100,
            fill: ["#e5c0fc"]
        }
    },
    cake: {
        position: {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        }
    },
    score: {
        x: 10,
        y: 10,
        anchor: 0,
        style: {
            fontFamily: "VT323",
            fontSize: 44,
            fill: ["#FF7F50"]
        }
    },
    platforms: {
        moveSpeed: -1.5,
        ranges: {
            rows: {
                min: 2,
                max: 6
            },
            cols: {
                min: 3,
                max: 9,
            },
            offset: {
                min: 200,
                max: 400,
            }
        }
    },
    hero: {
        jumpSpeed: 12,
        maxJumps: 2,
        position: {
            x: 350,
            y: 590,
        }
    },
    diamonds: {
        chance: 0.2,
        offset: {
            min: 100,
            max: 200
        }
    },
    loader: Tools.massiveRequire(require["context"]('./../../sprites/', true, /\.(mp3|png|jpe?g)$/)),
    startScene: Game,
    scenes: {
        "Game": Game,
        "Win": Win,
    },
}