export class Scoreboard {

    constructor(pos) {
        this.scores = {};
        this.pos = pos ?? { x: 0, y: 0 };
    }

    set(name, score) {
        this.scores[name] = score;
    }

    *emit() {
        const text = Object.entries(this.scores).map(s => s.join(': ')).join(' | ');
        yield {
            x: this.pos.x,
            y: this.pos.y,
            text,
            size: 40,
            style: 'Arial',
            kind: 'text'
        };
    }
}
