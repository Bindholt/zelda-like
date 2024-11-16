window.addEventListener('load', start);

const field = document.querySelector("#gamefield");
function start() {
    requestAnimationFrame(tick);
    attatchEventListeners();

    setInterval(() => {
        if(controls.up || controls.down || controls.left || controls.right) {
            cycleMovement();
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
    look();
    move(deltaTime);
    displayPlayer();
}

const player = {
    element: document.querySelector("#player"),
    x: 0,
    y: 0,
    speed: 100,
    movementCycle: 0
}

const controls = {
    up: false,
    down: false,
    left: false,
    right: false
}

function look() {
    if(controls.up) player.element.style.backgroundPositionY = "120px";
    if(controls.down) player.element.style.backgroundPositionY = "0px";
    if(controls.left) player.element.style.backgroundPositionY = "80px";
    if(controls.right) player.element.style.backgroundPositionY = "40px";
}


function move(deltaTime) {
    const newPos = {x: player.x, y: player.y};
    if(controls.up) newPos.y -= player.speed * deltaTime;
    if(controls.down) newPos.y += player.speed * deltaTime;
    if(controls.left) newPos.x -= player.speed * deltaTime;
    if(controls.right) newPos.x += player.speed * deltaTime;

    if(canMove(player,newPos)) {
        player.x = newPos.x;
        player.y = newPos.y;
    }
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
                controls.up = true;
                break;
            case "a":
            case "ArrowLeft":
                controls.left = true;
                break;
            case "d":
            case "ArrowRight":
                controls.right = true;
                break;
            case "s":
            case "ArrowDown":
                controls.down = true;
                break;
        }
    });

    window.addEventListener("keyup", (e) => {
        switch (e.key) {
            case "w":
            case "ArrowUp":
                controls.up = false;
                break;
            case "a":
            case "ArrowLeft":
                controls.left = false;
                break;
            case "d":
            case "ArrowRight":
                controls.right = false;
                break;
            case "s":
            case "ArrowDown":
                controls.down = false;
                break;
        }
    });
}

function canMove(player, newPos) {
    if(newPos.x < 0 || newPos.x > field.clientWidth - player.element.clientWidth) return false;
    if(newPos.y < 0 || newPos.y > field.clientHeight - player.element.clientHeight) return false;
    return true;
}

function cycleMovement() {
    if(player.movementCycle == 3) {
        player.movementCycle = 0;
    } else {
        player.movementCycle++;
    }
}