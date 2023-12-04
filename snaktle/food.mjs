import { SPRITE_LAYER } from "./renderer.mjs";

export class Food {

    layer = SPRITE_LAYER;

    constructor(size, initial) {
        this.sizeY = size?.y ?? 20;
        this.sizeX = size?.x ?? 20;
        this.pos = initial ?? { x: 0, y: 0 };
    }

    respawn(pos) {
        this.pos = pos;
    }

    *draw() {
        yield {
            x: this.pos.x,
            y: this.pos.y,
            t: this.sizeX,
            h: this.sizeY,
            style: 'blue'
        };
    }

    isEaten(pos) {
        const { x, y } = this.pos;
        const maxX = x + this.sizeX;
        const maxY = y + this.sizeY;
        const minX = x;
        const minY = y;
        return (pos.x - pos.w) <= maxX &&
            (pos.x + pos.w) >= minX &&
            pos.y <= maxY &&
            pos.y >= minY;
    }
}
