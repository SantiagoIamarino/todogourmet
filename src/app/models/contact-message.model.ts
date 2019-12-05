// tslint:disable-next-line: class-name
export class contactMessage {

    constructor(
        public name: string,
        public email: string,
        public lastName?: string,
        public address?: string,
        public phone?: number,
        public affair?: string,
        public message?: string,
        public date?: Date,
        public readed = false,
        public important = false,
        public _id?: string
    ) {}

}
