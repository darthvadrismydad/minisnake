import { SPRITE_LAYER } from "./renderer.mjs";

export class Sprite {

    layer = SPRITE_LAYER;

    constructor(shape, color, thickness) {
        this.shape = shape;
        this.color = color ?? 'white';
        this.thickness = thickness ?? 1;
        this.body = [];
    }

    move(pos) {
        this.body = this.shape.map(({ x, y }) => ({ x: x + pos.x, y: y + pos.y }));
    }

    *draw() {
        if(this.body.length === 0) return;

        yield {
            kind: 'freeform',
            coords: this.body,
            t: this.thickness,
            style: this.color
        };
    }
}
