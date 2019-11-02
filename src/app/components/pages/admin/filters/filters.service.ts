import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Filter } from '../../../../models/filter.model';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  constructor(
    private afs: AngularFirestore
  ) { }

  // tslint:disable: prefer-for-of
  sanitizeFilter(filter) {
    // Characters to delete
    const specialChars = '!@#$^&%*()+=-[]\/{}|:<>?,.';

    // Deleting special characters
    for (let i = 0; i < specialChars.length; i++) {
        filter = filter.replace(new RegExp('\\' + specialChars[i], 'gi'), '');
    }

    filter = filter.replace(/á/gi, 'a');
    filter = filter.replace(/é/gi, 'e');
    filter = filter.replace(/í/gi, 'i');
    filter = filter.replace(/ó/gi, 'o');
    filter = filter.replace(/ú/gi, 'u');
    filter = filter.replace(/ñ/gi, 'n');

    filter = filter.toLowerCase();

    // Removing whitespaces
    filter = filter.replace(/ /g, '');

    return filter;
  }

  getFilters( collection ) {
    return this.afs.collection(collection).valueChanges();
  }

  uploadFilter( filter: Filter, collection ) {
    filter = JSON.parse(JSON.stringify(filter));

    return this.afs.collection(collection).add( filter );
  }

}
