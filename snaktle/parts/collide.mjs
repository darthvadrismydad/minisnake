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

export class CircleCollide {

    constructor(source, size, onOverlap, tag) {
        this.source = source;
        this.size = size ?? source.size ?? 1;
        this.onOverlap = onOverlap;
        this.tag = tag;
    }

    *emit() {
        const coords = [];
        for (const item of this.source.emit()) {
            if (item.kind === 'rect') {
                coords.push({ x: item.x, y: item.y });
                coords.push({ x: item.x + item.t, y: item.y });
                coords.push({ x: item.x + item.t, y: item.y + item.h });
                coords.push({ x: item.x, y: item.y + item.h });
            } else {
                coords.push(item.coords || item);
            }
            yield item;
        }

        const flattened = coords
            .reduce((a, b) => Array.isArray(b) ? a.concat(b) : a.concat([b]), [])

        yield {
            kind: 'bounds',
            coords: flattened,
            size: this.size,
            overlapTest: CircleCollide.isOverlapping.bind(null, { coords: flattened, size: this.size }),
            onOverlap: this.onOverlap,
            tag: this.tag
        };
    }

    static isOverlapping(a, b) {
        return distance(a.coords, b.coords) < a.size + b.size;
    }
}

export class BoxCollide {

    constructor(source, onOverlap, invert, tag) {
        this.source = source;
        this.onOverlap = onOverlap;
        this.tag = tag;
        this.invert = invert;
    }

    *emit() {
        const bounds = [];
        for (const item of this.source.emit()) {
            if (item.kind === 'rect') {
                bounds.push({
                    minX: item.x,
                    minY: item.y,
                    maxX: item.x + item.h,
                    maxY: item.y + item.t
                });
            } else {
                // make boxes with all the points
                const { coords } = item;
                const xs = coords.map(c => c.x);
                const ys = coords.map(c => c.y);
                bounds.push({
                    minX: Math.min(...xs),
                    minY: Math.min(...ys),
                    maxX: Math.max(...xs),
                    maxY: Math.max(...ys)
                });
            }
            yield item;
        }

        yield {
            kind: 'bounds',
            coords: bounds,
            size: this.size,
            overlapTest: (this.invert ?
                BoxCollide.isOutOfBounds : BoxCollide.isInBounds).bind(null, bounds),
            onOverlap: this.onOverlap,
            tag: this.tag
        };
    }

    static isInBounds(bounds, other) {
        return other.coords.some(b =>
            bounds.some(bound =>
                b.x >= bound.minX && b.x <= bound.maxX && b.y >= bound.minY && b.y <= bound.maxY
            )
        );
    }

    static isOutOfBounds(bounds, other) {
        return !BoxCollide.isInBounds(bounds, other);
    }
}
