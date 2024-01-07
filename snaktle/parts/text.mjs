export class Text {

    constructor(source, text) {
        this.source = source;
        this.text = text;
    }

    *emit() {
        for (const { x, y } of this.source.emit()) {
            yield {
                x,
                y,
                text: typeof this.text === 'function' ? this.text() : this.text,
                size: 40,
                style: 'Arial',
                kind: 'text'
            };
        }
    }
}
