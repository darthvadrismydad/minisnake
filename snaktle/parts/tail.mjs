import { Dequeue } from "../dequeue.mjs";

export class Tail {

    constructor(source, size) {
        this.path = new Dequeue();
        this.source = source;
        this.size = size;
    }

    *emit() {
        for (const src of this.source.emit()) {
            if (this.path.size > this.size) {
                this.path.removeBack();
            }

            this.path.addFront({ ...src });
        }

        for (const pos of this.path) {
            yield pos;
        }
    }
}
