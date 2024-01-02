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
            this.shape = points;
            this.storedActions.forEach(a => a());
        });
    }

    *emit() {
        for(const { x, y } of this.shape) {
            yield { x, y };
        }
    }
}
