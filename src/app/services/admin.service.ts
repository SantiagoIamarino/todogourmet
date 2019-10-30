import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private afs: AngularFirestore
  ) { }


  uploadMarca( marca ) {
    return this.afs.collection('marcas').add( marca );
  }

  uploadFilter( filter, filterType ) {
    return this.afs.collection(filterType).add( filter );
  }
}
