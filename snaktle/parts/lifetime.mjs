export class Lifetime {
    constructor(source) {
        this.source = source;
        this.expired = false;
    }

    *emit() {
        if (this.expired) {
            return;
        }

        yield* this.source.emit();
    }
}
