import { BACKGROUND_LAYER, SPRITE_LAYER } from '../renderer.mjs';
import { merge } from './genutils.mjs';
import { Block, Paint, Layer, Sum, Static, Tail, Shape, Controller, Bot } from './parts/index.mjs';

function player(startingPos) {
    return new Sum(
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


export function setup(bounds) {
    return [
        new Layer(SPRITE_LAYER,
            merge(
                snake(player({ x: 100, y: 100 })),
                snake(new Sum(new Bot([
                    { x: 1, y: 0 },
                    { x: 0, y: 1 },
                    { x: 0, y: -1 },
                ], 1), { x: 500, y: 500 }))
            ),
        ),
        new Layer(BACKGROUND_LAYER, [
            new Block(
                new Static({ x: bounds.minX, y: bounds.minY }),
                bounds.maxX - bounds.minX,
                bounds.maxY - bounds.minY,
                'black'
            )
        ])
    ];
}

