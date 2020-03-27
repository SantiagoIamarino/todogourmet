import { Component, OnInit } from '@angular/core';

import * as XLSX from 'xlsx';
import { Product } from '../../../../models/product.model';
import { ProductService } from '../../../../services/product.service';
import { LoadingService } from '../../../shared/loading/loading.service';

declare var swal;

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {

  arrayBuffer: any;
  file: File;

  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.loadingService.loading = false;
  }

  incomingfile(event) {
    this.file = event.target.files[0];
  }

  Upload() {
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
      this.uploadProducts(XLSX.utils.sheet_to_json(worksheet, {raw: true}));
    };

    fileReader.readAsArrayBuffer(this.file);
  }

  async uploadProducts(products) {
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
        productToAdd.gramaje.number = (product.GRAMAJE) ? product.GRAMAJE.split(' ')[0] : '';
        productToAdd.gramaje.unity = (product.GRAMAJE) ? product.GRAMAJE.split(' ')[1] : '';
        productToAdd.visibleFor = 'BOTH';
        productToAdd.moreInfo = product.DESCRIPCION;

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

        products[index] = productToAdd;
      });

      this.productService.importProducts(products);
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

}
