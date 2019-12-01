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
        public provincia: any = {
            nombre: '',
            id: ''
        },
        public localidad: any = {
            nombre: '',
            id: ''
        },
        public birthDay?: string,
        public newsletter = false,
        public surtido = [],
        public _id = ''
    ) {}
}
