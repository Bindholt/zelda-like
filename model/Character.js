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

    constructor(config) {
        this.element = document.querySelector(`#${config.id}`) ?? null;
        this.x = config.x ?? 0;
        this.y = config.y ?? 0;
        this.speed = config.speed ?? 100;
        this.movementCycle = 0;
        this.width = config.width ?? 32;
        this.height = config.height ?? 40;


        this.updatePosition();
    }

    updatePosition() {
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
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

    move(deltaTime, field) {
        const newPos = { x: this.x, y: this.y };
        if (this.controls.up) newPos.y -= this.speed * deltaTime;
        if (this.controls.down) newPos.y += this.speed * deltaTime;
        if (this.controls.left) newPos.x -= this.speed * deltaTime;
        if (this.controls.right) newPos.x += this.speed * deltaTime;

        if (this.canMove(newPos, field)) {
            this.x = newPos.x;
            this.y = newPos.y;
        }
    }

    canMove(newPos, field) {
        if (newPos.x < 0 || newPos.x + this.width > field.width) {
            return false;
        }
        if (newPos.y < 0 || newPos.y + this.height > field.height) return false;
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
}