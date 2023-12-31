import { Renderer } from './renderer.mjs';
import { setup } from './config.mjs';

function resizeCanvas() {
    const canvas = document.getElementById('drawing');

    // Set the display size (CSS dimensions)
    canvas.style.width = (window.innerWidth) + 'px';
    canvas.style.height = (window.innerHeight) + 'px';

    // Set the size of the drawingBuffer (canvas bitmap)
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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

    let token = null;
    let lastUpdate = Date.now();
    let fps = { value: 0 };

    const sources = setup(bounds, fps);

    renderer.withSources(sources);

    const tick = 0;

    function update() {
        renderer.renderFrame();
        const now = Date.now();
        fps.value = Math.round(1000 / (now - lastUpdate));
        lastUpdate = now;
        token = setTimeout(update, tick);
    }
    token = setTimeout(update, tick);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', startGame);

