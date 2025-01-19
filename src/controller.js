import Player from "./model/Player.js";
import Enemy from "./model/Enemy.js";
import Grid from "./model/Grid.js";
import {map as level1 } from "./model/maps/map1.js";
import {items as itemsLevel1} from "./model/maps/items1.js";
import * as view from "./view.js";
import * as api from "./apiTools.js";

window.addEventListener('load', start);

let player;
let enemy;
let grid;
let itemsGrid;
let currentInteractable;
let lastAnimationFrame;
async function start() {
    console.log("Controller.js");

    view.init();
    try {
        await api.init();
    } catch (error) {
        console.error("Error during initialization:", error);
    }
    initializeLevel();
    /* DEBUG */
    window.grid = grid;
    window.itemsGrid = itemsGrid;
    window.player = player;
    window.enemy = enemy;
    window.showDebugging = view.showDebugging;
    window.view = view;
    window.initializeLevel = initializeLevel;
}

function initializeLevel() {
    resetGameState() 
    grid = new Grid(9, 16);
    itemsGrid = new Grid(9, 16);
    grid.loadMap(level1);
    itemsGrid.loadMap(itemsLevel1);
    player = new Player();
    const {x, y} = getRandomStartingPosition();
    player.x = x;
    player.y = y;
    enemy = new Enemy();

    view.createTiles(grid);
    view.createItems(itemsGrid);
    view.attatchEventListeners();
    lastAnimationFrame = requestAnimationFrame(tick);

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

function resetGameState() {
    // Cancel animation frame (if any)
    cancelAnimationFrame(lastAnimationFrame);
    
    // Clear player and enemy references
    player = null;
    enemy = null;

    
    // Reset other global state variables if needed
    currentInteractable = null;
    lastTime = 0;
    pathCycle = 0;
    grid = null;
    itemsGrid = null;

}

let lastTime = 0;

function tick(time) {
    requestAnimationFrame(tick);
    const deltaTime = (time - lastTime)/1000;
    lastTime = time;
    playerMovement(deltaTime);
    view.displayCharacter(enemy); //fjern igen hvis enemy skal bevæge sig
    //enemyMovement(deltaTime);
    view.displayTiles();
    view.displayItems();
    view.displayInventory();
    showDebugging();
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
            interactPrompt.textContent = "'E' to open";
            player.element.appendChild(interactPrompt);
            currentInteractable = interactableItem;
        }
    } else {
        document.querySelectorAll(".interact-prompt").forEach(prompt => prompt.remove());
        currentInteractable = null;
    }

    view.displayCharacter(player);
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

    view.displayCharacter(enemy);
}


function interact() {
    if(currentInteractable) {
        //If pot, add whats inside pot to inventory and smash pot
        if(currentInteractable.type === 1 && currentInteractable.inventory.length > 0) {
            player.addToInventory(currentInteractable.inventory);
            currentInteractable.inventory = [];
            currentInteractable.type = 3; //smashed pot
            currentInteractable.interactable = false;
            return;
        }

        //if door, check if player has key in inventory, then open door
        if(currentInteractable.type === 4 && player.inventory.includes("key")) {
            currentInteractable.type = 0;
            currentInteractable.interactable = false;
            return;
        } else {
            player.talk("I will need a key to open this door!")
        }

    }
}

function getRandomStartingPosition() {
    const x = Math.floor(Math.random() * grid.width);
    const y = Math.floor(Math.random() * grid.height);
    const isNotInHouse = (!(x > 360 && y < 125)); 
    const { topleft, topright, bottomleft, bottomright } = player.hitboxCorners({ x, y });
    if(player.canMove(topleft, grid, itemsGrid)
        && player.canMove(topright, grid, itemsGrid)
        && player.canMove(bottomleft, grid, itemsGrid)
        && player.canMove(bottomright, grid, itemsGrid)
        && isNotInHouse) {
        return {x, y};
    }

    return getRandomStartingPosition();
}

export {
    interact,
    grid,
    itemsGrid,
    player,
}