import { TEXT_LAYER } from "./renderer.mjs";

export class Scoreboard {

    layer = TEXT_LAYER;

    constructor(pos) {
        this.scores = {};
        this.pos = pos ?? { x: 0, y: 0 };
    }

    set(name, score) {
        this.scores[name] = score;
    }

    average(name, score) {
        this.scores[name] = Math.round(((this.scores[name] ?? score) + score) / 2)
    }

    *draw() {
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
