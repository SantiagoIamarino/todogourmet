import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userHours'
})
export class UserHoursPipe implements PipeTransform {

  transform(hours: any): any {
    let message = '';
    hours.forEach(hour => {
      if (hour.active) {
        if (message.length > 0) {
          message += ' - ' + hour.day + ' de ' + hour.hour;
          return;
        } else {
          message += hour.day + ' de ' + hour.hour;
        }

        if (hour.moreHours.active) {
          message += ' Y de ' + hour.moreHours.hour;
        }

      }
    });
    return message;
  }

}
