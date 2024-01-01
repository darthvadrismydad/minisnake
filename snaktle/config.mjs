import { Controller } from './controller.mjs';
import { Sprite } from './sprite.mjs';
import { Moveable } from './moveable.mjs';
import { Collide } from './collide.mjs';
import { ChaosBot } from './bot.mjs';
import { Scoreboard } from './scoreboard.mjs';
import { Snake } from './snake.mjs';

export function configureSources(canvas, bounds, fps) {

    const controller = new Controller();
    const snake = new Snake(100, 10);
    const head = new Sprite(
        [
            { x: 10, y: 10 },
            { x: 0, y: 10 },
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 },
        ],
        'green',
        4
    );

    const moving = new Moveable(
        { x: Math.floor(canvas.width / 2), y: Math.floor(canvas.height / 2) },
        1,
        [head, snake]
    );

    controller.attach(moving.setDirection.bind(moving));

    const food = new Sprite(
        [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 },
            { x: 0, y: 0 },
        ],
        'blue',
        10
    );

    const scoreboard = new Scoreboard({
        x: 100,
        y: 50
    });

    const enemyRoute = new ChaosBot([
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 0, y: -1 },
    ]);

    const enemies = Array(10).fill(0).map((_, i) => {
        const e = new Moveable(
            { x: Math.floor(canvas.width / 2), y: Math.floor(canvas.height / ((Math.random() * 100) % 6)) },
            1,
            new Sprite(
                [
                    { x: 10, y: 10 },
                    { x: 0, y: 10 },
                    { x: 0, y: 0 },
                    { x: 10, y: 0 },
                    { x: 10, y: 10 },
                    { x: 0, y: 10 },
                ],
                'red',
                4
            )
        );
        enemyRoute.attach(e.setDirection.bind(e));
        return new Collide(e, 10, () => {
            enemies.splice(i, i);
        });
    });

    setInterval(function() {
        scoreboard.set('score', snake.size);
        scoreboard.set('bounds', `${canvas.height}, ${canvas.width}`);
        scoreboard.set('snake', `${Math.floor(moving.pos.x)}, ${Math.floor(moving.pos.y)}`);
        scoreboard.set('fps', fps.value);
    }, 200);


    return [
        moving,
        new Collide(moving, 10),
        new Collide(food, 10, () => {
            food.move({
                x: Math.floor(Math.random() * (bounds.maxX - bounds.minX)) + bounds.minX,
                y: Math.floor(Math.random() * (bounds.maxY - bounds.minY)) + bounds.minY
            });
            snake.grow();
        }),
        new Collide(head, 1, () => { }),
        ...enemies,
        scoreboard,
    ];
}
