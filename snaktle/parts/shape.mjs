export class Shape {

    constructor(shape, source) {
        this.shape = shape;
        this.source = source;
    }

    *emit() {
        for (const src of this.source.emit()) {
            for (const { x, y } of this.shape) {
                yield {
                    x: src.x + x,
                    y: src.y + y
                };
            }
        }
    }
}
