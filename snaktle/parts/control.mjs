export class Controller {

    constructor() {
        this.lastDirection = { x: 0, y: 0 };

        document.addEventListener('keydown', (e) => {
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

    notify() {
        this.lastDirection = { x: 0, y: 0 };
    }

    *emit() {
        yield this.lastDirection;
    }
}

export class Bot {

    /**
     * @param {{ x: number, y: number }[]} orders
     */
    constructor(orders, randomize, tick) {
        this.order = orders;
        this.currentOrder = orders[0];
        const indexFn = randomize ? 
            (o) => o[Math.floor((Math.random() * 1000)) % this.order.length]
            : (o) => o[++this.lastOrder % this.order.length];
        setInterval(() => {
            this.currentOrder = indexFn(this.order);
        }, tick ?? 1000);
        this.lastOrder = this.order.length - 1;
    }

    *emit() {
        yield this.currentOrder;
    }
}

