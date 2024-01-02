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

export class Bot {

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

export class ChaosBot {

    /**
     * @param {{ x: number, y: number }[]} orders
     */
    constructor(orders) {
        this.order = orders;
    }

    attach(onMove) {
        setInterval(() => {
            onMove(this.order[Math.floor((Math.random() * 1000)) % this.order.length]);
        }, 1000);
    }
}
