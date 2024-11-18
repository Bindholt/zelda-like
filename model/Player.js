import Character from './Character.js';

export default class Player extends Character{
    constructor(config){
        super({
            id: "player",
            x: config?.x ?? 0,
            y: config?.y ?? 150,
            speed: config?.speed ?? 100,
            ...config,
            enemy: false,
        });
    }
}
