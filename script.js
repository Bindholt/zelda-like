import Player from "/model/Player.js";
import Enemy from "/model/Enemy.js";
import Field from "/model/Field.js";

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
    },100);
}

let lastTime = 0;

function tick(time) {
    requestAnimationFrame(tick);
    const deltaTime = (time - lastTime)/1000;
    lastTime = time;
    player.look();
    player.move(deltaTime, field);
    if(player.isCollidingWith(enemy)) {
        player.element.style.backgroundColor = "red";
    } else {
        player.element.style.backgroundColor = "";
    }
    displayPlayer();
}

function displayPlayer() {
    player.element.style.translate = `${player.x}px ${player.y}px`;
    player.element.style.backgroundPositionX = player.movementCycle * 100 + '%';
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