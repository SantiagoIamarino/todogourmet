export class Product {

    constructor(
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
        public visibleFor?: string,
        public _id?: string
    ) {}
}
