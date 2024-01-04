export class Point {
    constructor(pos) {
        this.pos = pos;
    }

    *emit() {
        yield this.pos;
    }
}

export class Sum {
    constructor(source, pos, multiplier) {
        this.initialPos = { ...pos };
        this.source = source;
        this.pos = pos;
        this.multiplier = multiplier ?? 1;
    }

    notify(args) {
        this.source.notify?.(args);
        this.pos = { ...this.initialPos };
    }

    *emit() {
        for (const { x, y } of this.source.emit()) {
            this.pos.x += (x * this.multiplier);
            this.pos.y += (y * this.multiplier);
        }
        yield this.pos;
    }
}

