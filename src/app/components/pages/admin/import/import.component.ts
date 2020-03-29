import { Component, OnInit } from '@angular/core';

import { Product } from '../../../../models/product.model';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ImportService } from '../../../../services/import.service';

declare var swal;

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {

  arrayBuffer: any;
  file: File;

  products: Product[] = [];

  constructor(
    private loadingService: LoadingService,
    private importService: ImportService
  ) { }

  ngOnInit() {
    this.loadingService.loading = false;
  }

  incomingfile(event) {
    this.file = event.target.files[0];
  }

  Upload() {
    this.importService.getDataFromExcelAndUpload(this.file, 'upload');
  }

}
