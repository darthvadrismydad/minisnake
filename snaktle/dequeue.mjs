export class Dequeue {
    constructor() {
        this.front = null;
        this.back = null;
        this.size = 0;
    }

    addFront(value) {
        const node = { value, next: null, prev: null };
        if (this.size === 0) {
            this.front = node;
            this.back = node;
        } else {
            node.next = this.front;
            this.front.prev = node;
            this.front = node;
        }
        this.size++;
    }

    addBack(value) {
        const node = { value, next: null, prev: null };
        if (this.size === 0) {
            this.front = node;
            this.back = node;
        } else {
            node.prev = this.back;
            this.back.next = node;
            this.back = node;
        }
        this.size++;
    }

    removeFront() {
        if (this.size === 0) {
            return;
        }
        const value = this.front.value;
        this.front = this.front.next;
        if (this.front) {
            this.front.prev = null;
        } else {
            this.back = null;
        }
        this.size--;
        return value;
    }

    removeBack() {
        if (this.size === 0) {
            return;
        }
        const value = this.back.value;
        this.back = this.back.prev;
        if (this.back) {
            this.back.next = null;
        } else {
            this.front = null;
        }
        this.size--;
        return value;
    }

    *[Symbol.iterator]() {
        let node = this.front;
        while (node) {
            yield node.value;
            node = node.next;
        }
    }
}
