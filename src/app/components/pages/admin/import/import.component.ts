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
        productToAdd.marca.nombre = product.MARCA;
        productToAdd.marca = product.MARCA;
        productToAdd.precioUnit = product.PRECIOUNITARIO;
        productToAdd.descuentoPorBulto = product.DESCPORBULTO;
        productToAdd.unidadPorBulto = product.UPORBULTO;
        productToAdd.precioComercio = product.PRECIOCOMERCIO;
        productToAdd.estaRefrigerado = (product.REFRIGERADO === 'SI') ? true : false;
        productToAdd.certificaciones = product.CERT.split('-');
        productToAdd.rubros = product.RUBROS.split('-');
        productToAdd.tipos = product.TIPOS.split('-');
        productToAdd.gramaje.number = product.GRAMAJE.split(' ')[0];
        productToAdd.gramaje.unity = product.GRAMAJE.split(' ')[1];
        productToAdd.visibleFor = 'BOTH';
        if (product.VISIBILIDAD !== 'AMBOS' && product.VISIBILIDAD === 'FINAL') {
          productToAdd.visibleFor = 'CONSUMER_ROLE';
        } else if (product.VISIBILIDAD !== 'AMBOS') {
          productToAdd.visibleFor = 'COMMERCE_ROLE';
        }

        await this.productService.uploadProduct(productToAdd).then( () => {
          if (index === products.length - 1) {
            swal('Productos subidos!', 'Se han cargado correctamente los productos desde el archivo importado', 'success');
          }
        } );
      });
  }

}
