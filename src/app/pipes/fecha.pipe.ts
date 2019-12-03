import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {

  transform(date: Date): any {

    // const monthNames = [
    //   'Enero', 'Febrero', 'Marzo',
    //   'Abril', 'Mayo', 'Junio', 'Julio',
    //   'Augosto', 'Septiembre', 'Octubre',
    //   'Noviembre', 'Diciembre'
    // ];

    // console.log(date.toUTCString());

    // const day = date.getDay();
    // const monthIndex = date.getMonth();
    // const year = date.getFullYear();

    // return day + ' ' + monthNames[monthIndex] + ' ' + year;

    return date;

  }

}
