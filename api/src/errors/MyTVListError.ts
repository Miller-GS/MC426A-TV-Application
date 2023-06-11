export class MyTVListError extends Error {
    private status;

    constructor(message, status) {
        super(message);
        this.status = status;
    }

    public getStatus() {
        return this.status;
    }
}
