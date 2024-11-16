import Player from "./model/Player.js";
import Enemy from "./model/Enemy.js";
import Field from "./Field.js";

window.addEventListener('load', start);

let player;
let enemy;
let field;
function start() {
    player = new Player();
    enemy = new Enemy();
    field = new Field();
    requestAnimationFrame(tick);
    attatchEventListeners();

    setInterval(() => {
        if(player.controls.up || player.controls.down || player.controls.left || player.controls.right) {
            player.cycleMovement();
        } else {
            player.movementCycle = 0;
        }
        if(enemy.controls.up || enemy.controls.down || enemy.controls.left || enemy.controls.right) {
            enemy.cycleMovement();
        } else {
            enemy.movementCycle = 0;
        }
    },100);
}

let lastTime = 0;

function tick(time) {
    requestAnimationFrame(tick);
    const deltaTime = (time - lastTime)/1000;
    lastTime = time;
    playerMovement(deltaTime);
    enemyMovement(deltaTime);
}

function playerMovement(deltaTime) {
    player.look();
    player.move(deltaTime, field);
    if (player.isCollidingWith(enemy)) {
        player.element.style.backgroundColor = "red";
    } else {
        player.element.style.backgroundColor = "";
    }
    displayCharacter(player);
}

function displayCharacter(character) {
    character.element.style.translate = `${character.x}px ${character.y}px`;
    character.element.style.backgroundPositionX = character.movementCycle * 100 + '%';
}

let pathCycle = 0;
function enemyMovement(deltaTime) {
    const path = [
        { x: 250, y: 50 },
        { x: 100, y: 50 }
    ];

    console.log("Path Cycle:", pathCycle);

    enemy.look();

    if (pathCycle === 0) {
        enemy.controls = {
            up: false,
            down: false,
            left: true,
            right: false,
        };
        enemy.move(deltaTime, field);

        if (enemy.x <= path[1].x) {
            pathCycle = 1;
        }
    }

    else if (pathCycle === 1) {
        enemy.controls = {
            up: false,
            down: false,
            left: false,
            right: true,
        };
        enemy.move(deltaTime, field);

        if (enemy.x >= path[0].x) {
            pathCycle = 0;
        }
    }

    displayCharacter(enemy);
}

function attatchEventListeners() {
    window.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "w":
            case "ArrowUp":
                player.controls.up = true;
                break;
            case "a":
            case "ArrowLeft":
                player.controls.left = true;
                break;
            case "d":
            case "ArrowRight":
                player.controls.right = true;
                break;
            case "s":
            case "ArrowDown":
                player.controls.down = true;
                break;
        }
    });

    window.addEventListener("keyup", (e) => {
        switch (e.key) {
            case "w":
            case "ArrowUp":
                player.controls.up = false;
                break;
            case "a":
            case "ArrowLeft":
                player.controls.left = false;
                break;
            case "d":
            case "ArrowRight":
                player.controls.right = false;
                break;
            case "s":
            case "ArrowDown":
                player.controls.down = false;
                break;
        }
    });
}