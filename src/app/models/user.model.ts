export class User {
    constructor(
        // tslint:disable: variable-name
        public phoneNumber?: string,
        public role = 'CONSUMER_ROLE',
        public name?: string,
        public userEmail?: string,
        public cuit?: string,
        public address?: string,
        public shippingAddress?: string,
        public specificHours: any[] = [],
        public hours?: any,
        public additionalHours?: any,
        public isMardel?: string,
        public birthDay?: string,
        public newsletter = false,
        public _id = ''
    ) {}
}
