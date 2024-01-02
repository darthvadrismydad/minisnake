import { Dequeue } from './dequeue.mjs';
import { BACKGROUND_LAYER, SPRITE_LAYER } from './renderer.mjs';

class Shape {

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

class Tail {

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

class StaticPosition {
    constructor(pos) {
        this.pos = pos;
    }

    *emit() {
        yield this.pos;
    }
}

class DynamicPosition {
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


export class Controller {

    constructor() {
        this.lastDirection = { x: 0, y: 0 };
        document.addEventListener('keyup', (e) => {
            const direction = this.getDirection(e.key);

            if (!direction) return;

            if (direction.x === 0 && direction.y === 0) {
                this.lastDirection = direction;
                return;
            }

            // prevent backwards movement
            if (direction.x === -this.lastDirection.x && direction.y === 0
                || direction.y === -this.lastDirection.y && direction.x === 0) {
                return;
            }

            this.lastDirection = direction;
        });
    }

    getDirection(key) {
        switch (key) {
            case 'ArrowUp':
            case 'w':
                return { x: 0, y: -1 }
            case 'ArrowDown':
            case 's':
                return { x: 0, y: 1 }
            case 'ArrowLeft':
            case 'a':
                return { x: -1, y: 0 }
            case 'ArrowRight':
            case 'd':
                return { x: 1, y: 0 }
            case '.':
                return { x: 0, y: 0 };
            default:
                break;
        }
    }

    *emit() {
        yield this.lastDirection;
    }
}

class Bot {

    /**
     * @param {{ x: number, y: number }[]} orders
     */
    constructor(orders, tick) {
        this.order = orders;
        this.currentOrder = orders[0];
        setInterval(() => {
            this.currentOrder = this.order[++this.lastOrder % this.order.length];
        }, tick ?? 1000);
        this.lastOrder = this.order.length - 1;
    }

    *emit() {
        yield this.currentOrder;
    }
}

class Paint {
    constructor(source, color, thickness) {
        this.source = source;
        this.color = color ?? 'white';
        this.thickness = thickness ?? 1;
    }

    *emit() {
        const coords = collect(this.source.emit());
        yield {
            coords,
            t: this.thickness,
            style: this.color
        };
    }
}

class Block {
    constructor(source, height, thickness, color) {
        this.source = source;
        this.height = height;
        this.thickness = thickness;
        this.color = color;
    }

    *emit() {
        for (const { x, y } of this.source.emit()) {
            yield {
                kind: 'rect',
                x,
                y,
                h: this.height,
                t: this.thickness,
                style: this.color
            };
        }
    }
}

class Layer {
    constructor(layer, sources) {
        this.sources = collect(sources);
        this.layer = layer;
    }

    *emit() {
        for (const source of this.sources) {
            yield* source.emit();
        }
    }
}


function player(startingPos) {
    return new DynamicPosition(
        new Controller(),
        startingPos
    );
}

function* snake(source) {
    yield new Paint(new Shape(
        [
            { x: 10, y: 10 },
            { x: 0, y: 10 },
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 },
        ],
        source
    ), 'green', 4);

    yield new Block(new Tail(
        source,
        100
    ), 10, 10, 'green');
}

function collect(generator) {
    if (!generator || Array.isArray(generator)) {
        return generator;
    }

    let result = [];
    let item;
    while (item = generator.next()) {
        if (item.done) break;
        result.push(item.value);
    }
    return result;
}

function* merge(...sources) {
    for (const source of sources) {
        yield* source;
    }
}

export function setup(bounds) {
    return [
        new Layer(SPRITE_LAYER,
            merge(
                snake(player({ x: 100, y: 100 })),
                snake(new DynamicPosition(new Bot([
                    { x: 1, y: 0 },
                    { x: 0, y: 1 },
                    { x: 0, y: -1 },
                ], 1), { x: 500, y: 500 }))
            ),
        ),
        new Layer(BACKGROUND_LAYER, [
            new Block(
                new StaticPosition({ x: bounds.minX, y: bounds.minY }),
                bounds.maxX - bounds.minX,
                bounds.maxY - bounds.minY,
                'black'
            )
        ])
    ];
}

