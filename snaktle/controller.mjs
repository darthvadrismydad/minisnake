export class Controller {

    constructor() {
        this.lastDirection = { x: 0, y: 0 };
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

    /**
     * @param {function({x: number, y: number}): void} onMove
     * @returns {void}
     */
    attach(onMove) {
        document.addEventListener('keyup', (e) => {
            const direction = this.getDirection(e.key);

            if (!direction) return;

            // prevent backwards movement
            if (direction.x === -this.lastDirection.x && direction.y === 0
                || direction.y === -this.lastDirection.y && direction.x === 0) {
                return;
            }

            this.lastDirection = direction;

            onMove(direction);
        });
    }
}
