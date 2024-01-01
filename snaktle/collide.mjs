import { SPRITE_LAYER } from "./renderer.mjs";

function centroid(a) {
    let cx = 0;
    let cy = 0;
    for (let i = 0; i < a.length; i++) {
        cx += a[i].x;
        cy += a[i].y;
    }
    return { x: cx / a.length, y: cy / a.length };
}

function distance(a, b) {
    const ac = centroid(a);
    const bc = centroid(b);

    const dx = ac.x - bc.x;
    const dy = ac.y - bc.y;

    return Math.sqrt(dx * dx + dy * dy);
}

export class Collide {

    layer = SPRITE_LAYER;

    constructor(source, size, onOverlap) {
        this.source = source;
        this.size = size ?? source.size ?? 1;
        this.onOverlap = onOverlap;
    }

    *draw() {
        const coords = [];
        for (const item of this.source.draw()) {
            coords.push(item.coords);
            yield item;
        }

        const flattened = coords
            .reduce((a, b) => Array.isArray(b) ? a.concat(b) : a.concat([b]), [])

        yield {
            kind: 'bounds',
            coords: flattened,
            size: this.size,
            overlapTest: Collide.isOverlapping.bind(null, { coords: flattened, size: this.size }),
            onOverlap: this.onOverlap
        };
    }

    static isOverlapping(a, b) {
        return distance(a.coords, b.coords) < a.size + b.size;
    }
}
