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

    move(deltaTime, grid) {
        const newPos = { x: this.x, y: this.y };
        
        if (this.controls.up) newPos.y -= this.speed * deltaTime;
        if (this.controls.down) newPos.y += this.speed * deltaTime;
        if (this.controls.left) newPos.x -= this.speed * deltaTime;
        if (this.controls.right) newPos.x += this.speed * deltaTime;
    
        // Check each corner for passability
        const topleft = { x: newPos.x - this.regX + this.hitbox.x, y: newPos.y - this.regY + this.hitbox.y };
        const topright = { x: topleft.x + this.hitbox.width, y: topleft.y };
        const bottomleft = { x: topleft.x, y: topleft.y + this.hitbox.height };
        const bottomright = { x: topright.x, y: bottomleft.y };
    
        if (
            this.canMove(topleft, grid)
            && this.canMove(topright, grid)
            && this.canMove(bottomleft, grid)
            && this.canMove(bottomright, grid)
        ) {
            this.x = newPos.x;
            this.y = newPos.y;
        }
    }
    

    canMove(newPos, grid) {
        const { row, col } = grid.getTileCoordUnder(newPos);
    
        // Check if the position is within the grid bounds
        if (row < 0 || row >= grid.rows() || col < 0 || col >= grid.cols()) return false;
    
        // Retrieve the tile value and check for impassable tiles
        const tileValue = grid.getTileAtCoord({ row, col });
        switch (tileValue) {
            case 2:
            case 3:
            case 5:
            case 6:
                return false;
        }
    
        return true; // Move is possible if no checks failed
    }
    

    // move(deltaTime, grid) {
    //     const newPos = { x: this.x, y: this.y };
    //     if (this.controls.up) newPos.y -= this.speed * deltaTime;
    //     if (this.controls.down) newPos.y += this.speed * deltaTime;
    //     if (this.controls.left) newPos.x -= this.speed * deltaTime;
    //     if (this.controls.right) newPos.x += this.speed * deltaTime;


    //     //check if topleft corner of hitbox can move
    //     this.topleft = { x: newPos.x + this.hitbox.x, y: newPos.y + this.hitbox.y };
    //     this.topright = { x: this.topleft.x + this.hitbox.width, y: this.topleft.y };
    //     this.bottomleft = { x: this.topleft.x, y: this.topleft.y + this.hitbox.height };
    //     this.bottomright = { x: this.topright.x, y: this.bottomleft.y };

    //     if (this.canMove(this.topleft, grid) && this.canMove(this.topright, grid) && this.canMove(this.bottomleft, grid) && this.canMove(this.bottomright, grid)) {
    //         this.x = newPos.x;
    //         this.y = newPos.y;
    //     }
    //     // if (this.canMove(newPos, grid)) {
    //     //     this.x = newPos.x;
    //     //     this.y = newPos.y;
    //     // }
    // }

    // canMove(newPos, grid) {
    //     const {row, col} = grid.getTileCoordUnder(newPos);

    //     if(row < 0 || row >= grid.rows() || col < 0 || col >= grid.cols()) return false;

    //     const tileValue = grid.getTileAtCoord({row, col});
    //     switch(tileValue) {
    //         case 2:
    //         case 3:
    //         case 5:
    //         case 6:
    //             return false;
    //     }

    //     return true;
    // }

    setControls(controls) {
        this.controls = controls;
    }

    isCollidingWith(character) {
        return this.x < character.x + character.width &&
            this.x + this.width > character.x &&
            this.y < character.y + character.height &&
            this.y + this.height > character.y;
    }
}
