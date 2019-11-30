export class Phone {
    constructor(
      public country = '54',
      public area = '9',
      public prefix?: string,
      public line?: string
    ) {}

    getPhoneNumer() {
      // tslint:disable-next-line: variable-name
      const number = this.country + this.area + this.prefix + this.line;
      return `+${number}`;
    }

    isValid() {
      if ( this.country && this.area && this.prefix && this.line ) {
        if (this.line.length > 6) {
          return true;
        }
      } else {
        return false;
      }
    }

}
