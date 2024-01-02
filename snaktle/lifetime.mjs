export class Lifetime {

    constructor(source) {
        this.source = source;
    }

    terminate() {
        this.expired = true;
    }

    *draw() {
        if(this.expired) {
            yield 'expired';
        }
        return this.source.draw();
    }
}
