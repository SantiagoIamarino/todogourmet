import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {

  constructor() { }

  validateProduct( product: Product ) {

    const validators = {
      isValid: false,
      errors : ''
    };

    if (!product.name) {
        validators.errors = 'Debes agregar un título';
        return validators;
    }

    if (!product.marca) {
        validators.errors = 'Debes agregar una marca';
        return validators;
    }

    if (!product.precioUnit || isNaN(product.precioUnit)) {
        validators.errors = 'Debes agregar un precio unitario valido';
        return validators;
    }

    if (!product.descuentoPorBulto || isNaN(product.descuentoPorBulto)) {
        validators.errors = 'Debes agregar un descuento por bulto valido';
        return validators;
    }
    if (!product.precioComercio || isNaN(product.precioComercio)) {
        validators.errors = 'Debes agregar un precio para comerciantes valido';
        return validators;
    } else {
        validators.isValid = true;
        return validators;
    }
  }
}
