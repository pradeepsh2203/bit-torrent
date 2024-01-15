export class Queue {
    private requested: Boolean[];
    private recieved: Boolean[];

    constructor(len: number | undefined) {
        this.recieved = new Array(len).fill(false);
        this.requested = new Array(len).fill(false);
    }

    addRequested(pieceIndex: number) {
        this.requested[pieceIndex] = true;
    }

    addRecieved(pieceIndex: number) {
        this.recieved[pieceIndex] = true;
    }

    isDone() {
        return this.recieved.every(i => i === true);
    }
}