import Player from "./model/Player.js";
import Enemy from "./model/Enemy.js";
import Grid from "./model/Grid.js";
import {map as level1, tileTypes } from "./model/maps/map1.js";
import {items as itemsLevel1, itemTypes} from "./model/maps/items1.js";

window.addEventListener('load', start);

let player;
let enemy;
let grid;
let itemsGrid;
let currentInteractable;
function start() {
    player = new Player();
    enemy = new Enemy();
    grid = new Grid(9, 16);
    itemsGrid = new Grid(9, 16);
    grid.loadMap(level1);
    itemsGrid.loadMap(itemsLevel1);
    createTiles();
    createItems();
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
    window.itemsGrid = itemsGrid;
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
    displayItems();
    //showDebugging();
}

function playerMovement(deltaTime) {
    player.look();
    player.move(deltaTime, grid, itemsGrid);
    if (player.isCollidingWith(enemy)) {
        player.element.style.backgroundColor = "red";
    } else {
        player.element.style.backgroundColor = "";
    }

    const interactableItem = player.isCollidingWithItem(itemsGrid);
    
    if(interactableItem) {
        if(document.querySelectorAll(".interact-prompt").length === 0) {
        const interactPrompt = document.createElement("div");
        interactPrompt.classList.add("interact-prompt");
        interactPrompt.textContent = "Press E to interact";
        player.element.appendChild(interactPrompt);
        currentInteractable = interactableItem;
    }} else {
        document.querySelectorAll(".interact-prompt").forEach(prompt => prompt.remove());
        currentInteractable = null;
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
        enemy.move(deltaTime, {width: grid.cols() * grid.tileSize, height: grid.rows() * grid.tileSize}, itemsGrid);

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
        enemy.move(deltaTime, {width: grid.cols() * grid.tileSize, height: grid.rows() * grid.tileSize}, itemsGrid);

        if (enemy.x >= path[0].x) {
            pathCycle = 0;
        }
    }

    displayCharacter(enemy);
}


/* VIEW */

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
            case "e":
                interact();
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

function interact() {
    if(currentInteractable) {
        //If pot, add whats inside pot to inventory and smash pot
        if(currentInteractable.type === 1 && currentInteractable.inventory.length > 0) {
            player.addToInventory(currentInteractable.inventory);
            currentInteractable.inventory = [];
            currentInteractable.type = 3; //smashed pot
            return;
        }

        //if door, check if player has key in inventory, then open door
        if(currentInteractable.type === 4 && player.inventory.includes("key")) {
            currentInteractable.type = 0;
            return;
        } else {
            console.log("You need a key to open this door");
        }

    }
}

function displayCharacter(character) {
    character.element.style.translate = `${character.x - character.regX}px ${character.y - character.regY}px`;
    character.element.style.backgroundPositionX = character.movementCycle * 100 + '%';
}


function createItems() {
    const itemLayer = document.querySelector("#items");
    itemLayer.style.setProperty("--GRID_WIDTH", itemsGrid.cols());
    for (let i = 0; i < itemsGrid.rows(); i++) {
        for (let j = 0; j < itemsGrid.cols(); j++) {
            const item = document.createElement("div");
            item.classList.add("item");
            item.style.width = itemsGrid.tileSize + "px";
            item.style.height = itemsGrid.tileSize + "px";
            itemLayer.appendChild(item);
        }
    }
}

function displayItems() {
    const visualTiles = document.querySelectorAll(".item");

    for(let row = 0; row < itemsGrid.rows(); row++) {
        for(let col = 0; col < itemsGrid.cols(); col++) {
            const index = row * itemsGrid.cols() + col;
            const visualTile = visualTiles[index];
            const tile = itemsGrid.getTileAtCoord({row, col});
            if(tile!=0) {
                visualTile.classList.add(getClassForItemType(tile.type));
            }
        }
    }
}

function getClassForItemType(type) {
    return itemTypes[type];
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
    return tileTypes[type];
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
    //debugShowTileUnder(player);
    //debugShowRegPoint(player);
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