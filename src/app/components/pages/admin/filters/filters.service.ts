import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Filter } from '../../../../models/filter.model';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  filterUploaded = new EventEmitter();

  filterDeleted = new EventEmitter();

  tempImg: any;

  constructor(
    private afs: AngularFirestore
  ) {
   }

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

  searchfilters( term: string, collection ) {
    return this.afs.collection(collection,
       ref => ref.orderBy('nombre')
                 .startAt(term)
                 .endAt(term + '\uf8ff')
    ).valueChanges();
  }

  uploadFilter( filter: Filter, collection ) {
    filter.formattedFilter = this.sanitizeFilter(filter.nombre);
    filter.id = new Date().valueOf().toString();

    filter = JSON.parse(JSON.stringify(filter));

    return this.afs.collection(collection).add( filter );
  }

  editFilter( filter: Filter, collection ) {
    const subscribe =
      this.afs.collection(collection, ref => ref.where('id', '==', filter.id))
          .snapshotChanges().subscribe( res => {
            const filterId = res[0].payload.doc.id;
            const filterDoc = this.afs.doc(collection + '/' + filterId);

            filter = JSON.parse(JSON.stringify(filter));

            subscribe.unsubscribe();

            filterDoc.update(filter).then( () => {
              this.filterUploaded.emit('Filter uploaded');
            } );
          });
  }

  deleteFilter( filter: Filter, collection ) {
    this.afs.collection(collection, ref => ref.where('id', '==', filter.id))
        .snapshotChanges().subscribe( res => {
          if (res.length > 0) {
            const filterId = res[0].payload.doc.id;
            const filterDoc = this.afs.doc(collection + '/' + filterId);

            filter = JSON.parse(JSON.stringify(filter));

            filterDoc.delete().then( () => {
              this.filterDeleted.emit('Filter deleted');
            } );
          }
        });
  }

}
