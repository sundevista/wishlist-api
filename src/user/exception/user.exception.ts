export class UserException extends Error {
    constructor(public readonly message = '') {
        super();
    }

    public what(): string {
        return this.message;
    }
}
