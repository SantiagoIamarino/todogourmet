import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FiltersService } from './filters.service';
import { Filter } from '../../../../models/filter.model';
import { UploadFileService } from '../../../../services/upload-file.service';

import sweetAlert from 'sweetalert';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['../productos/productos.component.css', './filters.component.css']
})
export class FiltersComponent implements OnInit {

  filters: Filter[] = [];

  filterType: string;
  filter: Filter = new Filter();

  imgToUpload: any;
  uploadProgress: any;

  loading = false;

  constructor(
    private adminService: AdminService,
    private filtersService: FiltersService,
    private uploadFileService: UploadFileService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.redirectIfIsIncorretType();
    this.getFilters(this.filterType);
   }

  ngOnInit() {
  }

  redirectIfIsIncorretType() {
    this.route.paramMap.subscribe( params => {
      this.filterType =  params.get('tipo');

      if (
          this.filterType !== 'marcas' && this.filterType !== 'tipos' && // Allowed filters
          this.filterType !== 'rubros' && this.filterType !== 'certificaciones'
         ) {
        this.router.navigate(['/admin']);
      }

    } );
  }

  getFilters(collection) {
    this.loading = true;

    this.filtersService.getFilters(collection).subscribe( filter => {
      this.filters = filter;
      this.loading = false;
    } );
  }

  imgSelected( event ) {

    if (event.target.files.length > 0) {
      this.imgToUpload = event.target.files[0];

      // const reader = new FileReader();
      // const urlImgTemp = reader.readAsDataURL( this.imgToUpload );

      // reader.onloadend = () => {
      //   this.tempImg = reader.result;
      // };
    }
  }

  uploadMarca() {
    

  }

  uploadFilter() {
    if (!this.imgToUpload) {
      sweetAlert('Error', 'Debes agregar una imagen', 'error');
      return;
    }

    if (!this.filter.nombre) {
      sweetAlert('Error', 'Debes agregar un nombre/titúlo', 'error');
      return;
    }

    this.uploadProgress = 'loading';

    this.uploadFileService.uploadImage( this.imgToUpload, this.filterType ).subscribe( percentage => {

      this.uploadFileService.downloadUrl.subscribe( url => {
        if (url && !this.filter.imagen) {
          this.filter.imagen = url; // Getting download URL
          this.filtersService.uploadFilter(this.filter, this.filterType).then( res => {

            sweetAlert(
              'Producto subido',
              'El producto se ha subido correctamente',
              'success'
            );

            this.filter = new Filter();

            this.uploadProgress = null;

            // this.tempImg = null;

          } );
        }
      } );

    } );
  }

}
