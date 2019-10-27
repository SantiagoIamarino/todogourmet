export class Product {

    validators = {
        isValid: false,
        errors : ''
    };

    constructor(
        public name?: string,
        public img?: any,
        public marca?: string,
        public presentacion = 'Bulto cerrado',
        public precioUnit?: number,
        public precioPor5?: number,
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
        } else {
            this.validators.isValid = true;
            return this.validators;
        }
    }
}
