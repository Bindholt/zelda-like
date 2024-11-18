import Player from "./model/Player.js";
import Enemy from "./model/Enemy.js";
import Grid from "./model/Grid.js";
import level1 from "./model/maps/map1.js";

window.addEventListener('load', start);

let player;
let enemy;
let grid;
function start() {
    player = new Player();
    enemy = new Enemy();
    grid = new Grid(9, 16);
    grid.loadMap(level1);
    createTiles();
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

    /* DEBUG */
    window.grid = grid;
    window.player = player;
    window.enemy = enemy;
    window.showDebugging = showDebugging;
}

let lastTime = 0;

function tick(time) {
    requestAnimationFrame(tick);
    const deltaTime = (time - lastTime)/1000;
    lastTime = time;
    playerMovement(deltaTime);
    displayCharacter(enemy);
    //enemyMovement(deltaTime);
    displayTiles();
    showDebugging();
}

function playerMovement(deltaTime) {
    player.look();
    player.move(deltaTime, grid);
    if (player.isCollidingWith(enemy)) {
        player.element.style.backgroundColor = "red";
    } else {
        player.element.style.backgroundColor = "";
    }
    displayCharacter(player);
}

let pathCycle = 0;
function enemyMovement(deltaTime) {
    const path = [
        { x: 250, y: 50 },
        { x: 100, y: 50 }
    ]; 

    enemy.look();

    if (pathCycle === 0) {
        enemy.controls = {
            up: false,
            down: false,
            left: true,
            right: false,
        };
        enemy.move(deltaTime, {width: grid.cols() * grid.tileSize, height: grid.rows() * grid.tileSize});

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
        enemy.move(deltaTime, {width: grid.cols() * grid.tileSize, height: grid.rows() * grid.tileSize});

        if (enemy.x >= path[0].x) {
            pathCycle = 0;
        }
    }

    displayCharacter(enemy);
}


//* VIEW */

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

function displayCharacter(character) {
    character.element.style.translate = `${character.x - character.regX}px ${character.y - character.regY}px`;
    character.element.style.backgroundPositionX = character.movementCycle * 100 + '%';
}

function createTiles() {
    const background = document.querySelector("#background");
    background.style.setProperty("--GRID_WIDTH", grid.cols());
    for (let i = 0; i < grid.rows(); i++) {
        for (let j = 0; j < grid.cols(); j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.style.width = grid.tileSize + "px";
            tile.style.height = grid.tileSize + "px";
            background.appendChild(tile);
        }
    }
}

function displayTiles() {
    const visualTiles = document.querySelectorAll(".tile");

    for(let row = 0; row < grid.rows(); row++) {
        for(let col = 0; col < grid.cols(); col++) {
            const index = row * grid.cols() + col;
            const tile = visualTiles[index];
            tile.classList.add(getClassForTileType(grid.getTileAtCoord({row, col})));
        }
    }
}

function getClassForTileType(type) {
    switch(type) {
        case 0:
            return "grass";
        case 1:
            return "path";
        case 2:
            return "wall";
        case 3:
            return "water";
        case 4:
            return "bridge";
        case 5:
            return "tree";
        case 6:
            return "door";
        case 7:
            return "floor_wood";
        case 8:
            return "flowers";
    }
}


/* DEBUG */
function debugHighlightTile(visualTile) {
    visualTile.classList.add("highlight");
}

function debugUnhighlightTile(visualTile) {
    visualTile.classList.remove("highlight");
}

let lastHighlight;
function debugShowTileUnder(character) {
    const {row, col} = grid.coordFromPos(character);
    const visualTile = getVisualTileFromCoords({row, col});

    if(lastHighlight != visualTile && lastHighlight) debugUnhighlightTile(lastHighlight);

    debugHighlightTile(visualTile);

    lastHighlight = visualTile;
}

function getVisualTileFromCoords({row, col}) {
    const visualTiles = document.querySelectorAll(".tile");
    const index = row * grid.cols() + col;

    return visualTiles[index];
}

function showDebugging() {
    debugShowTileUnder(player);
    debugShowHitbox(player);
}

function debugShowRegPoint(character) {
    character.element.style.setProperty("--regX", character.regX + "px");
    character.element.style.setProperty("--regY", character.regY + "px");
}

function debugShowHitbox(character) {
    character.element.style.setProperty("--hitboxX", character.hitbox.x + "px");
    character.element.style.setProperty("--hitboxY", character.hitbox.y + "px");
    character.element.style.setProperty("--hitboxWidth", character.hitbox.width + "px");
    character.element.style.setProperty("--hitboxHeight", character.hitbox.height + "px");
}