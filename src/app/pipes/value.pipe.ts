import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'value'
})
export class ValuePipe implements PipeTransform {

  transform(value: any): any {
    const filter = value.toLowerCase();

    const filterParts = filter.split(' ');

    let filterWithoutSpaces = '';

    let formattedValue = '';

    if ( filterParts.length <= 1 ) {
      formattedValue = filter;
    } else {
      filterParts.forEach((filterPart, index) => {
        if (index !== filterParts.length - 1 ) {
          filterWithoutSpaces += filterPart + '_' ;
        } else {
          filterWithoutSpaces += filterPart;
        }
      });

      formattedValue = filterWithoutSpaces;
    }

    return formattedValue;

  }
}
