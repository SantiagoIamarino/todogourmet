export class Product {

    validators = {
        isValid: false,
        errors : ''
    };

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
        public id?: string
    ) {}

    validateProduct() {
        if (!this.name) {
            this.validators.errors = 'Debes agregar un título';
            return this.validators;
        }

        if (!this.marca) {
            this.validators.errors = 'Debes agregar una marca';
            return this.validators;
        }

        if (!this.precioUnit || isNaN(this.precioUnit)) {
            this.validators.errors = 'Debes agregar un precio unitario valido';
            return this.validators;
        }

        if (!this.descuentoPorBulto || isNaN(this.descuentoPorBulto)) {
            this.validators.errors = 'Debes agregar un descuento por bulto valido';
            return this.validators;
        }
        if (!this.precioComercio || isNaN(this.precioComercio)) {
            this.validators.errors = 'Debes agregar un precio para comerciantes valido';
            return this.validators;
        } else {
            this.validators.isValid = true;
            return this.validators;
        }
    }
}
