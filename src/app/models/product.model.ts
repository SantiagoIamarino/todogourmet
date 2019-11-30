export class Product {

    constructor(
        public name?: string,
        public img?: any,
        public marca = {
            nombre: '',
            formatted: ''
        },
        public precioUnit?: number,
        public descuentoPorBulto?: number,
        public precioComercio?: number,
        public estaRefrigerado = false,
        public certificaciones = [],
        public rubros = [],
        public tipos = [],
        public quantity: number = 1,
        public total?: number,
        public _id?: string
    ) {}
}
