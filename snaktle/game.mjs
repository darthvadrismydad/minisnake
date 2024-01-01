import { BACKGROUND_LAYER, Renderer } from './renderer.mjs';
import { Snake } from './snake.mjs';
import { Sprite } from './sprite.mjs';
import { GipptySprite } from './gipptysprite.mjs';
import { Food } from './food.mjs';
import { Scoreboard } from './scoreboard.mjs';
import { Controller } from './controller.mjs';
import { Collide } from './collide.mjs';
import { Moveable } from './moveable.mjs';
import { Bot, ChaosBot } from './bot.mjs';

function resizeCanvas() {
    const canvas = document.getElementById('drawing');

    // Set the display size (CSS dimensions)
    canvas.style.width = (window.innerWidth) + 'px';
    canvas.style.height = (window.innerHeight) + 'px';

    // Set the size of the drawingBuffer (canvas bitmap)
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
function isOutOfBounds(pos, bounds) {
    const { minX, maxX, minY, maxY } = bounds;
    return pos.x > maxX || pos.y > maxY || pos.x < minX || pos.y < minY;
}
function startGame() {
    const canvas = document.getElementById("drawing");
    resizeCanvas(canvas);

    const ctx = canvas.getContext("2d");

    const renderer = new Renderer(ctx);

    const bounds = {
        maxX: canvas.width,
        minX: 50,
        maxY: canvas.height,
        minY: 100
    };

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
        'black',
        1
    );

    // const food = new GipptySprite('star 10px', 'black');

    food.move({
        x: Math.floor(canvas.width / 3),
        y: Math.floor(canvas.height / 2)
    });

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

    const enemies = Array(100).fill(0).map((_, i) => {
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
        return new Collide(e, 10, () => console.log("enemy hit", i));
    });


    renderer.withSources(
        new Collide(moving, 10, () => { }),
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
        // {
        //     layer: BACKGROUND_LAYER,
        //     *draw() {
        //         yield {
        //             style: 'black',
        //             x: bounds.minX,
        //             y: bounds.minY,
        //             h: bounds.maxX - bounds.minX,
        //             t: bounds.maxY - bounds.minY,
        //         }
        //     }
        // }
    );

    let token = null;
    let lastUpdate = Date.now();

    setInterval(function() {
        scoreboard.set('score', snake.size);
        scoreboard.set('bounds', `${canvas.height}, ${canvas.width}`);
        scoreboard.set('snake', `${Math.floor(moving.pos.x)}, ${Math.floor(moving.pos.y)}`);
    }, 200);

    const tick = 0;

    function update() {
        renderer.renderFrame();
        const now = Date.now();
        scoreboard.average('fps', Math.floor(1000 / (now - lastUpdate)));
        lastUpdate = now;
        token = setTimeout(update, tick);
    }
    token = setTimeout(update, tick);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', startGame);

