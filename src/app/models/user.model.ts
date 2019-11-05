export class User {
    constructor(
        // tslint:disable-next-line: variable-name
        public _uid?: string,
        public phoneNumber?: string,
        public role = 'USER_ROLE'
    ) {}
}
