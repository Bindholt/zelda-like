import Character from "./Character.js";

export default class Enemy extends Character {
    constructor(config) {
        super({
            id: "enemy",
            x: 287,
            y: 1,
            speed: 100,
            ...config,
            enemy: true,
        });
    }
}
