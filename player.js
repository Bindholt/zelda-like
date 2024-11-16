import Character from './character.js';

export default class Player extends Character{
    constructor(config){
        super({
            id: "player",
            x: 0,
            y: 0,
            speed: 100,
            ...config,
            enemy: false,
        });
    }
}
