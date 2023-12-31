import { SPRITE_LAYER } from "./renderer.mjs";

export class Moveable {

    layer = SPRITE_LAYER;

    constructor(pos, speed, skele) {
        this.skele = skele;
        this.initialPos = pos;
        this.pos = { ...pos };
        this.speed = speed ?? 1;
        this.direction = { x: 0, y: 0 };
    }

    setDirection(dir) {
        this.direction = dir;
    }

    move() {
        this.pos.x += this.direction.x * this.speed;
        this.pos.y += this.direction.y * this.speed;

        if (Array.isArray(this.skele)) {
            for (const s of this.skele) {
                s.move({...this.pos});
            }
        } else {
            this.skele.move({...this.pos});
        }
    }

    reset() {
        this.direction = { x: 0, y: 0 };
        this.pos = { ...this.initialPos };
    }

    *draw() {
        this.move();

        if (Array.isArray(this.skele)) {
            for (const s of this.skele) {
                for (const item of s.draw()) {
                    yield item;
                }
            }
        } else {
            for (const item of this.skele.draw()) {
                yield item;
            }
        }
    }
}
