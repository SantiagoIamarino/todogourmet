export class Product {

    constructor(
        public name?: string,
        public img?: any,
        public marca = '',
        public precioUnit?: number,
        public descuentoPorBulto?: number,
        public precioComercio?: number,
        public estaRefrigerado = false,
        public certificaciones = [],
        public rubros = [],
        public tipos = [],
        public _id?: string
    ) {}
}
