export class User {
    constructor(
        // tslint:disable: variable-name
        public phoneNumber?: string,
        public role = 'CONSUMER_ROLE',
        public cuit?: string,
        public address?: string,
        public _id?: string
    ) {}
}
