import { Pipe, PipeTransform } from '@angular/core';
import { Product } from 'src/app/models/product.model';

@Pipe({
  name: 'productOneLine'
})
export class ProductOneLinePipe implements PipeTransform {

  transform(products: Product[]): any {
    let oneLineProducts = '';

    console.log(products);

    products.forEach(product => {
      if (oneLineProducts !== '') {
        oneLineProducts += ', ' + product.name;
      } else {
        oneLineProducts += product.name;
      }
    });
    return oneLineProducts;
  }

}
