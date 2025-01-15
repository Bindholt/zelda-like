import Character from "./Character.js";

export default class Enemy extends Character {
    constructor(config) {
        super({
            id: "enemy",
            x: config?.x ?? 430,
            y: config?.y ?? 50,
            speed: config?.speed ?? 100,
            ...config,
            enemy: true,
        }); 
    }
}
