import { Pipe, PipeTransform } from '@angular/core';
import { BACKEND_URL } from '../config/config';

@Pipe({
  name: 'images'
})
export class ImagesPipe implements PipeTransform {

  transform(image: any): any {

    let url = BACKEND_URL + '/images';

    if (!image) {
      return url + '/user/xxx';
    }

    if (image.indexOf('https') >= 0) { // Verifiying if is an url image
      return image;
    }

    url += '/' + image;

    return url;

  }

}
