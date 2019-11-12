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
    const discount = 1 - parseFloat('0.' + desc);
    const precioPorBulto = precio * discount;

    return precioPorBulto;
  }

}
