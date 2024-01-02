export class Static {
    constructor(pos) {
        this.pos = pos;
    }

    *emit() {
        yield this.pos;
    }
}

export class Sum {
    constructor(source, pos) {
        this.source = source;
        this.pos = pos;
    }

    *emit() {
        for (const { x, y } of this.source.emit()) {
            this.pos.x += x;
            this.pos.y += y;
        }
        yield this.pos;
    }
}

