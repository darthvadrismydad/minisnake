import { SPRITE_LAYER } from "./renderer.mjs";

export class Composite {

    layer = SPRITE_LAYER;

    constructor(pos, sprites) {
        this.pos = pos;
        this.sprites = sprites;
    }

    setDirection(direction) {
        for (const sprite of this.sprites) {
            sprite.move(direction);
        }
    }

    *draw() {
        for (const sprite of this.sprites) {
            for(const d of sprite.draw()) {
                yield d;
            }
        }
    }
}
