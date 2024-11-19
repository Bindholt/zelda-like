import Character from './Character.js';

export default class Player extends Character{
    inventory = [];
    interactionBox;
    constructor(config){
        super({
            id: "player",
            x: config?.x ?? 50,
            y: config?.y ?? 150,
            speed: config?.speed ?? 100,
            ...config,
            enemy: false,
        });
        this.interactionBox = config?.interactionBox ?? { x: 2, y: 15, width: 28, height: 30 };
    }

    isCollidingWithItem(itemsGrid) {
        const { topleft, topright, bottomleft, bottomright } = this.interactionBoxCorners();
        const { row: row1, col: col1 } = itemsGrid.coordFromPos(topleft);
        const { row: row2, col: col2 } = itemsGrid.coordFromPos(topright);
        const { row: row3, col: col3 } = itemsGrid.coordFromPos(bottomleft);
        const { row: row4, col: col4 } = itemsGrid.coordFromPos(bottomright);

        //check if out of bounds
        if(row1 < 0 || row1 >= itemsGrid.rowNum || col1 < 0 || col1 >= itemsGrid.colNum) return false;
        if(row2 < 0 || row2 >= itemsGrid.rowNum || col2 < 0 || col2 >= itemsGrid.colNum) return false;
        if(row3 < 0 || row3 >= itemsGrid.rowNum || col3 < 0 || col3 >= itemsGrid.colNum) return false;
        if(row4 < 0 || row4 >= itemsGrid.rowNum || col4 < 0 || col4 >= itemsGrid.colNum) return false;


        const item1 = itemsGrid.get(row1, col1);
        const item2 = itemsGrid.get(row2, col2);
        const item3 = itemsGrid.get(row3, col3);
        const item4 = itemsGrid.get(row4, col4);

        if(item1?.interactable) return item1;
        if(item2?.interactable) return item2;
        if(item3?.interactable) return item3;
        if(item4?.interactable) return item4;

        return false;
    }

    interactionBoxCorners() {
        const topleft = { x: this.x - this.regX + this.interactionBox.x, y: this.y - this.regY + this.interactionBox.y };
        const topright = { x: this.x - this.regX + this.interactionBox.x + this.interactionBox.width, y: this.y - this.regY + this.interactionBox.y };
        const bottomleft = { x: this.x - this.regX + this.interactionBox.x, y: this.y - this.regY + this.interactionBox.y + this.interactionBox.height };
        const bottomright = { x: this.x - this.regX + this.interactionBox.x + this.interactionBox.width, y: this.y - this.regY + this.interactionBox.y + this.interactionBox.height };

        return { topleft, topright, bottomleft, bottomright };
    }

    addToInventory(items) {
        items.forEach(item => {
            this.inventory.push(item);
        });
    }
}
