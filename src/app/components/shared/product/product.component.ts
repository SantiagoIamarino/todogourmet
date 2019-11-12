import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../../models/product.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Input() product: Product = new Product();

  certificaciones = [];

  imageLoaded = false;

  constructor(
    private afs: AngularFirestore,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.getCertifications();
  }

  getCertifications() {
    if (this.product.certificaciones) {
      this.loadingService.loading = true;

      this.product.certificaciones.forEach((certification, index) => {
        const subscriber =
        this.afs.collection('certificaciones', ref =>
        ref.where('formattedFilter', '==', certification).limit(1))
        .valueChanges().subscribe( (DBCert: any) => {
            this.certificaciones.push(DBCert[0]);

            subscriber.unsubscribe();

            if (index === this.certificaciones.length - 1) {
              this.loadingService.loading = false;
            }
          } );
      });
    }
  }

}
