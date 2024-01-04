import { collect } from '../genutils.mjs';

export class Layer {
    constructor(layer, sources) {
        this.sources = collect(sources);
        this.layer = layer;
    }

    *emit() {
        for (const source of this.sources) {
            yield* source.emit();
        }
    }
}

export class Paint {
    constructor(source, color, thickness) {
        this.source = source;
        this.color = color ?? 'white';
        this.thickness = thickness ?? 1;
    }

    *emit() {
        const coords = collect(this.source.emit());
        yield {
            coords,
            t: this.thickness,
            style: this.color
        };
    }
}

export class Block {
    constructor(source, height, thickness, color) {
        this.source = source;
        this.height = height;
        this.thickness = thickness;
        this.color = color;
    }

    *emit() {
        for (const { x, y } of this.source.emit()) {
            yield {
                kind: 'rect',
                x,
                y,
                h: this.height,
                t: this.thickness,
                style: this.color
            };
        }
    }
}
