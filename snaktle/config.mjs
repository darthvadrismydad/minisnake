import { BACKGROUND_LAYER, SPRITE_LAYER, TEXT_LAYER } from './renderer.mjs';
import { merge } from './genutils.mjs';
import {
    CircleCollide,
    BoxCollide,
    Block,
    Paint,
    Layer,
    Sum,
    Point,
    Tail,
    Shape,
    Controller,
    Lifetime,
    Text,
    Scoreboard
} from './parts/index.mjs';

function player(startingPos) {
    return new Sum(
        new Controller(),
        startingPos,
        1
    );
}

function* snake(source, { color, growthFactor, score }) {

    const tail = new Tail(source, growthFactor);
    score.value = tail.size - growthFactor;

    yield new Block(tail, 10, 10, color);

    yield new CircleCollide(
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
        1,
        (e) => {
            if (e.tag === 'end') {
                tail.size = 0;
                source.notify();
                return;
            }
            if (e.tag === 'bg') return;
            tail.size += growthFactor;
            score.value = tail.size;
        },
        'snake'
    );
}

function* box(bounds) {
    const point = new Point({
        x: Math.random() * (bounds.maxX - bounds.minX) + bounds.minX,
        y: Math.random() * (bounds.maxY - bounds.minY) + bounds.minY
    });

    const life = new Lifetime(
        new CircleCollide(
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
            (e) => {
                if (e.tag === 'bg') return;
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

export function setup(bounds, fps) {
    const score = { value: 0 };
    return [
        new Layer(TEXT_LAYER, [
            new Text(
                new Point({ x: bounds.minX, y: bounds.minY - 10 }),
                () => Object.entries({
                    score,
                    fps
                }).map(([k, v]) => `${k}: ${v.value}`).join(' | '),
            ),
        ]),
        new Layer(SPRITE_LAYER,
            merge(
                snake(player({ x: 100, y: 100 }), { 
                    color: 'green', 
                    growthFactor: 10 ,
                    score: score
                }),
                multiply(100, box.bind(null, bounds)),
            ),
        ),
        new Layer(BACKGROUND_LAYER, [
            new BoxCollide(
                new Block(
                    new Point({
                        x: bounds.minX,
                        y: bounds.minY
                    }),
                    bounds.maxX - bounds.minX,
                    bounds.maxY - bounds.minY,
                    'black'
                ),
                (e) => {
                    e.onOverlap({ tag: 'end' });
                },
                true,
                'bg'
            )])
    ];
}

