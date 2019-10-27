import { Injectable, EventEmitter } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  images: any[] = [];

  uploadPercentage: Observable<number>;

  public downloadUrl = new EventEmitter();

  constructor(
    private storage: AngularFireStorage
  ) { }

   uploadImage(image) {

    console.log(image);

    const file = image;
    image.path = '/products/' + image.name;
    const fileRef = this.storage.ref(image.path);
    const task = this.storage.upload(image.path, file);

    this.uploadPercentage = task.percentageChanges();

    return this.uploadPercentage.pipe(

      finalize( () => {
        fileRef.getDownloadURL().subscribe( url => {
          this.downloadUrl.emit(url);
        } );
      } )

    );

   }

}
