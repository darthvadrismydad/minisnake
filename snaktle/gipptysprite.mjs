import { SPRITE_LAYER } from "./renderer.mjs";

export class GipptySprite {

    layer = SPRITE_LAYER;

    constructor(input, color) {
        this.storedActions = [];
        this.color = color ?? 'white';
        this.shape = [];
        fetch('http://localhost:3000/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: input
        }).then(r => r.json()).then(({ points }) => {
            console.log("sprite generated");
            this.shape = points;
            this.storedActions.forEach(a => a());
        });
    }

    move(pos) {
        if (this.shape.length === 0) {
            this.storedActions.push(() => {
                this.body = this.shape.map(({ x, y }) => ({ x: x + pos.x, y: y + pos.y }))
            });
        } else {
            this.body = this.shape.map(({ x, y }) => ({ x: x + pos.x, y: y + pos.y }))
        }
    }

    *draw() {
        if (!this.body || this.body.length === 0) return;

        yield {
            kind: 'freeform',
            coords: this.body,
            t: this.thickness,
            style: this.color
        };
    }
}
