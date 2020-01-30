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
        public hours = [
            {
                day: 'Lunes',
                hour: '',
                active: false,
                moreHours: {
                    active: false,
                    hour: ''
                }
            },
            {
                day: 'Martes',
                hour: '',
                active: false,
                moreHours: {
                    active: false,
                    hour: ''
                }
            },
            {
                day: 'Miercoles',
                hour: '',
                active: false,
                moreHours: {
                    active: false,
                    hour: ''
                }
            },
            {
                day: 'Jueves',
                hour: '',
                active: false,
                moreHours: {
                    active: false,
                    hour: ''
                }
            },
            {
                day: 'Viernes',
                hour: '',
                active: false,
                moreHours: {
                    active: false,
                    hour: ''
                }
            },
            {
                day: 'Sabado',
                hour: '',
                active: false,
                moreHours: {
                    active: false,
                    hour: ''
                }
            },
            {
                day: 'Domingo',
                hour: '',
                active: false,
                moreHours: {
                    active: false,
                    hour: ''
                }
            }
        ],
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
