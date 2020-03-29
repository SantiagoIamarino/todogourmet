import { Injectable } from '@angular/core';

import * as XLSX from 'xlsx';
import { Product } from '../models/product.model';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  arrayBuffer: any;

  constructor(
    private productService: ProductService
  ) { }

  getDataFromExcelAndUpload(file: File, action) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, {type: 'binary'});
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      this.sanitizeProduct(XLSX.utils.sheet_to_json(worksheet, {raw: true}), action);
    };

    fileReader.readAsArrayBuffer(file);
  }

  sanitizeProduct(products, action) {
    products.forEach(async (product, index) => {
      const productToAdd = new Product();

      productToAdd.name = product.PRODUCTO;
      productToAdd.img = product.IMAGEN;
      productToAdd.marca.nombre = this.sanitizeValue(product.MARCA);
      productToAdd.marca = this.sanitizeValue(product.MARCA);
      productToAdd.precioUnit = product.PRECIOUNITARIO;
      productToAdd.descuentoPorBulto = product.DESCPORBULTO;
      productToAdd.unidadPorBulto = product.UPORBULTO;
      productToAdd.precioComercio = product.PRECIOCOMERCIO;
      productToAdd.estaRefrigerado = (product.REFRIGERADO === 'SI' || product.REFRIGERADO === 'si') ? true : false;
      productToAdd.refrigeradoTime = product.DIASREFRIGERADO;
      productToAdd.certificaciones = (product.CERT) ? product.CERT.split('-') : [] ;
      productToAdd.rubros = (product.RUBROS) ? product.RUBROS.split('-') : [] ;
      productToAdd.tipos = (product.TIPOS) ? product.TIPOS.split('-') : [] ;
      productToAdd.gramaje.number = (product.CANTIDAD) ? product.CANTIDAD.split(' ')[0] : '';
      productToAdd.gramaje.unity = (product.CANTIDAD) ? product.CANTIDAD.split(' ')[1] : '';
      productToAdd.visibleFor = 'BOTH';
      productToAdd.moreInfo = product.DESCRIPCION;
      productToAdd.barCode = product.CODIGO;

      if (product.VISIBILIDAD !== 'AMBOS' && product.VISIBILIDAD === 'FINAL') {
        productToAdd.visibleFor = 'CONSUMER_ROLE';
      } else if (product.VISIBILIDAD !== 'AMBOS') {
        productToAdd.visibleFor = 'COMMERCE_ROLE';
      }
      if (productToAdd.rubros.length > 0) {
        productToAdd.rubros.forEach((rubro, i) => {
          productToAdd.rubros[i] = this.sanitizeValue(rubro);
        });
      }

      if (productToAdd.tipos.length > 0) {
        productToAdd.tipos.forEach((tipo, i) => {
          productToAdd.tipos[i] = this.sanitizeValue(tipo);
        });
      }

      if (productToAdd.certificaciones.length > 0) {
        productToAdd.certificaciones.forEach((certificacion, i) => {
          productToAdd.certificaciones[i] = this.sanitizeValue(certificacion);
        });
      }

      if (action === 'edit' && product.IDENTIFICADOR) {
        productToAdd.idNumber = product.IDENTIFICADOR;
      }

      products[index] = productToAdd;
    });

    if (action === 'edit') {
      this.productService.editProducts(products);
    } else {
      this.uploadProducts(products);
    }
  }

  sanitizeValue(value) {
    if (!value) {
      return;
    }
    // Characters to delete
    const specialChars = '!@#$^&%*()+=-[]\/{}|:<>?,.';

    // Deleting special characters
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < specialChars.length; i++) {
        value = value.replace(new RegExp('\\' + specialChars[i], 'gi'), '');
    }

    value = value.replace(/á/gi, 'a');
    value = value.replace(/é/gi, 'e');
    value = value.replace(/í/gi, 'i');
    value = value.replace(/ó/gi, 'o');
    value = value.replace(/ú/gi, 'u');
    value = value.replace(/ñ/gi, 'n');

    value = value.toLowerCase();

    // Removing whitespaces
    value = value.replace(/ /g, '');

    return value;
  }

  async uploadProducts(products) {
    this.productService.importProducts(products);
  }

}
