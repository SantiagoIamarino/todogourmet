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
        public dni?: string,
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
        public commerceName?: string,
        public contactPerson?: string,
        public _id = ''
    ) {}
}
