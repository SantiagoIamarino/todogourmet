export class Product {

    constructor(
        public idNumber?: any,
        public name?: string,
        public img?: any,
        public marca: any = {
            nombre: '',
            formatted: ''
        },
        public precioUnit?: number,
        public descuentoPorBulto?: number,
        public unidadPorBulto?: number,
        public precioComercio?: number,
        public estaRefrigerado = false,
        public refrigeradoTime?: string,
        public certificaciones = [],
        public rubros = [],
        public tipos = [],
        public quantity: number = 1,
        public total?: number,
        public destacado?: boolean,
        public gramaje: any = {
            number: '',
            unity: ''
        },
        public barCode?: string,
        public visibleFor?: string,
        public moreInfo?: string,
        public _id?: string
    ) {}
}
