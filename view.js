import * as controller from "./controller.js";
import { tileTypes } from "./model/maps/map1.js";
import { itemTypes } from "./model/maps/items1.js";

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
                controller.interact();
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

function createItems() {
    const itemLayer = document.querySelector("#items");
    itemLayer.style.setProperty("--GRID_WIDTH", controller.itemsGrid.cols());
    for (let i = 0; i < controller.itemsGrid.rows(); i++) {
        for (let j = 0; j < controller.itemsGrid.cols(); j++) {
            const item = document.createElement("div");
            item.classList.add("item");
            item.style.width = controller.itemsGrid.tileSize + "px";
            item.style.height = controller.itemsGrid.tileSize + "px";
            itemLayer.appendChild(item);
        }
    }
}

function displayItems() {
    const visualTiles = document.querySelectorAll(".item");

    for(let row = 0; row < controller.itemsGrid.rows(); row++) {
        for(let col = 0; col < controller.itemsGrid.cols(); col++) {
            const index = row * controller.itemsGrid.cols() + col;
            const visualTile = visualTiles[index];
            const tile = controller.itemsGrid.getTileAtCoord({row, col});
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
    background.style.setProperty("--GRID_WIDTH", controller.grid.cols());
    for (let i = 0; i < controller.grid.rows(); i++) {
        for (let j = 0; j < controller.grid.cols(); j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.style.width = controller.grid.tileSize + "px";
            tile.style.height = controller.grid.tileSize + "px";
            background.appendChild(tile);
        }
    }
}

function displayTiles() {
    const visualTiles = document.querySelectorAll(".tile");

    for(let row = 0; row < controller.grid.rows(); row++) {
        for(let col = 0; col < controller.grid.cols(); col++) {
            const index = row * controller.grid.cols() + col;
            const tile = visualTiles[index];
            tile.classList.add(getClassForTileType(controller.grid.getTileAtCoord({row, col})));
        }
    }
}

function getClassForTileType(type) {
    return tileTypes[type];
}


function displayInventory() {
    const inventory = controller.player.inventory;
    const visualInventory = document.querySelector("#inventory-items");
    const inventoryItems = Array.from(document.querySelectorAll(".inventory-item"), e => e.innerHTML);
    for(let i = 0; i < inventory.length; i++) {
        if(inventoryItems.includes(inventory[i])) continue;

        const item = document.createElement("li");
        item.classList.add("inventory-item");
        item.innerHTML = inventory[i];
        visualInventory.appendChild(item);
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
    const {row, col} = controller.grid.coordFromPos(character);
    const visualTile = getVisualTileFromCoords({row, col});

    if(lastHighlight != visualTile && lastHighlight) debugUnhighlightTile(lastHighlight);

    debugHighlightTile(visualTile);

    lastHighlight = visualTile;
}

function getVisualTileFromCoords({row, col}) {
    const visualTiles = document.querySelectorAll(".tile");
    const index = row * controller.grid.cols() + col;

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

export {
    attatchEventListeners,
    displayCharacter,
    createItems,
    displayItems,
    getClassForItemType,
    createTiles,
    displayTiles,
    getClassForTileType,
    debugHighlightTile,
    debugUnhighlightTile,
    debugShowTileUnder,
    getVisualTileFromCoords,
    showDebugging,
    debugShowRegPoint,
    debugShowHitbox,
    displayInventory
}