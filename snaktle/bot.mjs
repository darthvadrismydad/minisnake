export class Bot {

    /**
     * @param {{ x: number, y: number }[]} orders
     */
    constructor(orders) {
        this.order = orders;
        this.lastOrder = this.order.length - 1;
    }

    attach(onMove) {
        setInterval(() => {
            onMove(this.order[++this.lastOrder % this.order.length]);
        }, 1000);
    }
}
