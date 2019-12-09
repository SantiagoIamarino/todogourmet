import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'precioBulto'
})
export class PrecioBultoPipe implements PipeTransform {

  constructor(
  ) {}

  transform(precio: any, desc: any): any {
    if (!desc) {
      return precio;
    }
    // tslint:disable-next-line: radix
    let discount: any;
    if (desc >= 10) {
      discount = 1 - parseFloat('0.' + desc);
    } else {
      discount = 1 - parseFloat('0.0' + desc);
    }
    let precioPorBulto: any = precio * discount;
    precioPorBulto = precioPorBulto.toFixed(2);

    return precioPorBulto;
  }

}
