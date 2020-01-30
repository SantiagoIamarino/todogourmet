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

    if (!product.gramaje.number || !product.gramaje.unity) {
      validators.errors = 'Debes agregar un gramaje';
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

    if (!product.unidadPorBulto || isNaN(product.unidadPorBulto)) {
      validators.errors = 'Debes agregar una cantidad de unidades por bulto valido';
      return validators;
  }

    if (!product.descuentoPorBulto || isNaN(product.descuentoPorBulto)) {
        validators.errors = 'Debes agregar un descuento por bulto valido';
        return validators;
    }

    if (!product.precioComercio || isNaN(product.precioComercio)) {
        validators.errors = 'Debes agregar un precio para comerciantes valido';
        return validators;
    }

    if (!product.visibleFor) {
      validators.errors = 'Debes especificar para que usuarios sera visible!';
      return validators;
    } else {
        validators.isValid = true;
        return validators;
    }

  }
}
