export class Snake {

    constructor(size, growthRate) {
        this.initialSize = size ?? 30;
        this.size = this.initialSize;
        this.sectionLength = 10;
        this.thickness = 10;
        this.body = [];
        this.color = 'green';
        this.growthRate = growthRate ?? 1;
    }

    move(pos) {
        if (this.body.length > this.size) {
            this.body.shift();
        }
        this.body.push(pos);
    }

    *draw() {
        for (const { x, y } of this.body) {
            yield {
                x,
                y,
                h: this.sectionLength,
                t: this.thickness,
                style: this.color
            };
        }
    }

    reset() {
        this.size = this.initialSize;
        this.body = [];
    }

    grow() {
        this.size += this.growthRate;
    }
}

