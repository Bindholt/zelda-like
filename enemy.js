import Character from "/character.js";

export default class Enemy extends Character {
    constructor(config) {
        super({
            id: "enemy",
            x: 250,
            y: 50,
            speed: 100,
            ...config,
            enemy: true,
        });
    }
}
