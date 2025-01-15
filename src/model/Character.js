export default class Character {
    element;
    x;
    y;
    width;
    height;
    speed;
    movementCycle;
    controls = {
        up: false,
        down: false,
        left: false,
        right: false,
    };
    regX;
    regY;
    hitbox;

    constructor(config) {
        this.element = document.querySelector(`#${config.id}`) ?? null;
        this.x = config.x ?? 0;
        this.y = config.y ?? 0;
        this.speed = config.speed ?? 100;
        this.movementCycle = 0;
        this.width = config.width ?? 32;
        this.height = config.height ?? 40;
        this.regX = config.regX ?? 14;
        this.regY = config.regY ?? 30;
        this.hitbox = config.hitbox ?? { x: 5, y: 20, width: 22, height: 20 };
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.translate = `${this.x}px, ${this.y}px`;
    }

    cycleMovement() {
        if (this.controls.up || this.controls.down || this.controls.left || this.controls.right) {
            this.movementCycle++;
        } else {
            this.movementCycle = 0;
        }
    }

    look() {
        if (this.controls.up) this.element.style.backgroundPositionY = "120px";
        if (this.controls.down) this.element.style.backgroundPositionY = "0px";
        if (this.controls.left) this.element.style.backgroundPositionY = "80px";
        if (this.controls.right) this.element.style.backgroundPositionY = "40px";
    }

    move(deltaTime, grid, itemsGrid) {
        let nextX = this.x

        if(this.controls.left) nextX -= this.speed * deltaTime;
        if(this.controls.right) nextX += this.speed * deltaTime;

        const { topleft: topleftX, topright: toprightX, bottomleft: bottomleftX, bottomright: bottomrightX } = this.hitboxCorners({ x: nextX, y: this.y });

        if (
            this.canMove(topleftX, grid, itemsGrid) &&
            this.canMove(toprightX, grid, itemsGrid) &&
            this.canMove(bottomleftX, grid, itemsGrid) &&
            this.canMove(bottomrightX, grid, itemsGrid)
        ) {
            this.x = nextX;
        }

        let nextY = this.y
        if (this.controls.up) nextY -= this.speed * deltaTime;
        if (this.controls.down) nextY += this.speed * deltaTime;

        const { topleft: topleftY, topright: toprightY, bottomleft: bottomleftY, bottomright: bottomrightY } = this.hitboxCorners({ x: this.x, y: nextY });

        if (
            this.canMove(topleftY, grid, itemsGrid) &&
            this.canMove(toprightY, grid, itemsGrid) &&
            this.canMove(bottomleftY, grid, itemsGrid) &&
            this.canMove(bottomrightY, grid, itemsGrid)
        ) {
            this.y = nextY;
        }
    }

    hitboxCorners(pos) {
        const topleft = { x: pos.x - this.regX + this.hitbox.x, y: pos.y - this.regY + this.hitbox.y };
        const topright = { x: topleft.x + this.hitbox.width, y: topleft.y };
        const bottomleft = { x: topleft.x, y: topleft.y + this.hitbox.height };
        const bottomright = { x: topright.x, y: bottomleft.y };

        return { topleft, topright, bottomleft, bottomright };
    }
    

    canMove(newPos, grid, itemsGrid) {
        const { row, col } = grid.getTileCoordUnder(newPos);
    
        if (row < 0 || row >= grid.rows() || col < 0 || col >= grid.cols()) return false;
        const tileValue = grid.getTileAtCoord({ row, col });
        switch (tileValue) {
            case 2:
            case 3:
            case 5:
            case 6:
                return false;
        }

        const itemValue = itemsGrid.getTileAtCoord({ row, col });
        switch (itemValue.type) {
            case 1:
            case 4:
                return false;
        }
    
        return true;
    }

    setControls(controls) {
        this.controls = controls;
    }

    isCollidingWith(character) {
        return this.x < character.x + character.width &&
            this.x + this.width > character.x &&
            this.y < character.y + character.height &&
            this.y + this.height > character.y;
    }

    talk(msg){
        const talkBubble = document.createElement("div");
        talkBubble.classList.add("talk-bubble");
        talkBubble.textContent = msg;

        this.element.appendChild(talkBubble);

        setTimeout(() => {
            talkBubble.remove();
        }, 2000);
    }
}
