import { Dequeue } from './dequeue.mjs';

export class Snake {

    constructor(size, growthRate) {
        this.initialSize = size ?? 30;
        this.size = this.initialSize;
        this.sectionLength = 10;
        this.thickness = 10;
        this.body = new Dequeue();
        this.color = 'green';
        this.growthRate = growthRate ?? 1;
    }

    move(pos) {
        if (this.body.size > this.size) {
            this.body.removeBack();
        }
        this.body.addFront(pos);
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
        this.body = new Dequeue();
    }

    grow() {
        this.size += this.growthRate;
    }
}

