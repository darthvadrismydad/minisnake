import { BACKGROUND_LAYER, Renderer } from './renderer.mjs';
import { Snake } from './snake.mjs';
import { Food } from './food.mjs';
import { Scoreboard } from './scoreboard.mjs';
import { Controller } from './controller.mjs';

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

    const snake = new Snake(
        // start in the center of the screen
        { x: Math.floor(canvas.width / 2), y: Math.floor(canvas.height / 2) },
        1000
    );

    controller.attach(snake.setDirection.bind(snake));

    const foodSize = { x: 20, y: 20 };
    const food = new Food(
        foodSize,
        {
            x: Math.min(bounds.maxX - foodSize.x, bounds.minX + (bounds.maxX * Math.random())),
            y: Math.min(bounds.maxY - foodSize.y, bounds.minY + (bounds.maxY * Math.random()))
        });
    const scoreboard = new Scoreboard({
        x: 100,
        y: 50
    });

    renderer.withSources(
        snake,
        food,
        scoreboard,
        {
            layer: BACKGROUND_LAYER,
            *draw() {
                yield {
                    style: 'black',
                    x: bounds.minX,
                    y: bounds.minY,
                    h: bounds.maxX - bounds.minX,
                    t: bounds.maxY - bounds.minY,
                }
            }
        }
    );

    let token = null;

    // const speed = document.getElementById('speed');
    // speed.addEventListener('change', function(e) {
    //     snake.speed = snake.initial.speed = e.target?.value ?? 1;
    // });

    setInterval(function() {
        scoreboard.set('score', snake.size);
        scoreboard.set('bounds', `${canvas.height}, ${canvas.width}`);
        scoreboard.set('snake', `${Math.floor(snake.pos.x)}, ${Math.floor(snake.pos.y)}`);
    }, 200);

    function update() {
        if (isOutOfBounds(snake.pos, bounds)) {
            snake.reset();
        } else if (food.isEaten({ ...snake.pos, w: snake.thickness })) {
            food.respawn({
                x: Math.min(bounds.maxX - food.sizeX, bounds.minX + (bounds.maxX * Math.random())),
                y: Math.min(bounds.maxY - food.sizeY, bounds.minY + (bounds.maxY * Math.random()))
            });
            snake.grow();
        }

        renderer.renderFrame();

        token = setTimeout(update, 0);
    }
    token = setTimeout(update, 0);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', startGame);

