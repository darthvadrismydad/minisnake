import { BACKGROUND_LAYER, SPRITE_LAYER, TEXT_LAYER } from './renderer.mjs';
import { merge } from './genutils.mjs';
import { Collide, Block, Paint, Layer, Sum, Point, Tail, Shape, Controller, Bot, Scoreboard, Lifetime } from './parts/index.mjs';

function player(startingPos) {
    return new Sum(
        new Controller(),
        startingPos
    );
}

function* snake(source, color) {

    const tail = new Tail(source, 100);

    yield new Block(tail, 10, 10, color);

    yield new Collide(
        new Paint(
            new Shape(
                [
                    { x: 10, y: 10 },
                    { x: 0, y: 10 },
                    { x: 0, y: 0 },
                    { x: 10, y: 0 },
                    { x: 10, y: 10 },
                    { x: 0, y: 10 },
                ],
                source
            ),
            color,
            4
        ),
        10,
        () => tail.size++
    );
}

function* box(bounds) {
    const point = new Point({
        x: Math.random() * (bounds.maxX - bounds.minX) + bounds.minX,
        y: Math.random() * (bounds.maxY - bounds.minY) + bounds.minY
    });

    const life = new Lifetime(
        new Collide(
            new Paint(
                new Shape(
                    [
                        { x: 10, y: 10 },
                        { x: 0, y: 10 },
                        { x: 0, y: 0 },
                        { x: 10, y: 0 },
                        { x: 10, y: 10 },
                        { x: 0, y: 10 },
                    ],
                    point
                ), 10, 10, 'red'),
            10,
            () => {
                life.expired = true;
            }
        ));

    yield life;
}

function* multiply(times, source) {
    for (let i = 0; i < times; i++) {
        yield* source();
    }
}

export function setup(bounds) {
    const scores = new Scoreboard({ x: bounds.minX, y: 50 });
    scores.set("score", 0);

    return [
        new Layer(TEXT_LAYER, [scores]),
        new Layer(SPRITE_LAYER,
            merge(
                snake(player({ x: 100, y: 100 }), 'green'),
                multiply(100, box.bind(null, bounds)),
                snake(new Sum(new Bot([
                    { x: 1, y: 0 },
                    { x: 0, y: 1 },
                    { x: 0, y: -1 },
                ], 1), { x: 500, y: 500 }), 'yellow')
            ),
        ),
        new Layer(BACKGROUND_LAYER, [
            new Block(
                new Point({ x: bounds.minX, y: bounds.minY }),
                bounds.maxX - bounds.minX,
                bounds.maxY - bounds.minY,
                'black'
            )
        ])
    ];
}

