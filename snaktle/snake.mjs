import { SPRITE_LAYER } from "./renderer.mjs";

export class Snake {

    layer = SPRITE_LAYER;

    constructor(pos, size, speed) {
        this.initial = { pos, size, speed };
        this.pos = pos ?? { x: 0, y: 0 };
        this.size = size ?? 30;
        this.sectionLength = 10;
        this.thickness = 10;
        this.body = [{ ...this.start }];
        this.lastDirection = { x: 0, y: 0 };
        this.direction = null;
        this.speed = speed ?? 1;
        this.color = 'green';
    }

    reset() {
        this.pos = this.initial.pos;
        this.speed = this.initial.speed ?? 1;
        this.size = this.initial.size ?? 30;
        this.direction = null;
        this.lastDirection = { x: 0, y: 0 };
        this.body = [{ ...this.pos }];
    }

    setDirection(direction) {
        this.direction = direction;
    }

    move() {
        const newX = this.pos.x + (this.direction.x * this.speed);
        const newY = this.pos.y + (this.direction.y * this.speed);

        if (this.body.length > this.size) {
            this.body.shift();
        }
        this.pos = { x: newX, y: newY };
        this.body.push({
            x: newX,
            y: newY,
        });
    }

    *draw() {
        if (!this.direction) return;

        this.move();

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

    grow() {
        this.size += this.sectionLength;
    }
}
