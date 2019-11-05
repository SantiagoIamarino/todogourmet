import { Injectable, EventEmitter } from '@angular/core';
import { contactMessage } from '../../../../models/contact-message.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  messageDeleted = new EventEmitter();

  constructor(
    private afs: AngularFirestore
  ) { }

  getMessages(){
    return this.afs.collection('messages').valueChanges();
  }

  uploadMessage( message: contactMessage ) {

    message.id = new Date().valueOf().toString();

    message = JSON.parse(JSON.stringify(message));

    return this.afs.collection('messages').add( message );
  }

  deleteMessage( message: contactMessage ) {
    this.afs.collection('messages', ref => ref.where('id', '==', message.id))
        .snapshotChanges().subscribe( res => {
          if (res.length > 0) {
            const messageId = res[0].payload.doc.id;
            const messageDoc = this.afs.doc('message' + '/' + messageId);

            messageDoc.delete().then( () => {
              this.messageDeleted.emit('Message deleted');
            } );
          }
        });
  }
}
