import { Injectable, EventEmitter } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BACKEND_URL } from '../config/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  images: any[] = [];

  uploadPercentage: any;

  public downloadUrl = new EventEmitter();

  constructor(
    private http: HttpClient
  ) { }

   uploadImage(image, anuncioId) {
    return new Promise( (resolve, reject) => {

      const formData = new FormData();

      formData.append('photo', image);

      const url = BACKEND_URL + '/upload/' + anuncioId;

      this.http.post(url, formData).subscribe( (resp: any) => {
        if (resp.ok) {
          this.uploadPercentage = '100';
          resolve('Images uploaded');
        }
      } );

    } );
   }

   uploadBannerImage(image) {
    return new Promise( (resolve, reject) => {

      const formData = new FormData();

      formData.append('photo', image.file);

      const url = BACKEND_URL + '/upload/banner/' + image.id;

      this.http.post(url, formData).subscribe( (resp: any) => {
        if (resp.ok) {
          this.uploadPercentage = '100';
          resolve('Images uploaded');
        }
      } );

    } );
   }

}
