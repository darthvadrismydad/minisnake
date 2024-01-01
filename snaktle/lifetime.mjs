export class Lifetime {

    constructor(source) {
    }

    *draw() {
        for (const source of this.sources) {
            yield* source.draw();
        }
    }
}
