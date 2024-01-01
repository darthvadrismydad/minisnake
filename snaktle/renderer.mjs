import { Collide } from "./collide.mjs";

export const TEXT_LAYER = 1;
export const SPRITE_LAYER = 2;
export const BACKGROUND_LAYER = 0;

export class Renderer {

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    constructor(ctx) {
        this.sources = [];
        this.ctx = ctx;
    }

    withSources(...sources) {
        for (const source of sources) {
            const layer = source.layer ?? 0;
            if (!this.sources[layer]) {
                this.sources[layer] = [];
            }
            this.sources[layer].push(source);
        }
    }

    renderFrame() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.save();
        const objects = [];
        for (const layer of this.sources) {
            if (!layer) continue;
            for (const source of layer) {
                for (const item of source.draw()) {
                    if (item.kind === 'bounds') {
                        objects.push(item);
                    }
                    else if (item.kind === 'freeform') {
                        const { coords, t, style } = item;
                        this.ctx.beginPath();
                        this.ctx.lineWidth = t;
                        const [start, ...rest] = coords;
                        this.ctx.moveTo(start.x, start.y);
                        for (const { x, y } of rest) {
                            this.ctx.lineTo(x, y);
                        }
                        this.ctx.strokeStyle = style;
                        this.ctx.stroke();
                        this.ctx.closePath();
                    }
                    else if (item.kind === 'text') {
                        const { x, y, style, text, size } = item;
                        this.ctx.font = `${size}px ${style}`;
                        const { width } = this.ctx.measureText(text);
                        this.ctx.fillText(text, x, y, width);
                    } else {
                        const { x, y, h, t, style } = item;
                        this.ctx.fillStyle = style;
                        this.ctx.fillRect(x, y, h, t);
                    }
                }
            }
        }
        if (objects.length > 1) {
            for (const a of objects) {
                for (const b of objects) {
                    if (a !== b) {
                        const isOverlapping = a.overlapTest(b);
                        if (isOverlapping && a.onOverlap) {
                           a.onOverlap(b); 
                        }
                    }
                }
            }
        }
        this.ctx.restore();
    }
}
