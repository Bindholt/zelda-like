import Character from "./Character.js";

export default class Enemy extends Character {
    constructor(config) {
        super({
            id: "enemy",
            x: config?.x ?? 416,
            y: config?.y ?? 16,
            speed: config?.speed ?? 100,
            ...config,
            enemy: true,
        }); 
    }
}
