import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Filter } from '../../../../../models/filter.model';
import { FiltersService } from '../filters.service';
import { UploadFileService } from '../../../../../services/upload-file.service';

@Component({
  selector: 'app-filters-form',
  templateUrl: './filters-form.component.html',
  styleUrls: ['./filters-form.component.css']
})
export class FiltersFormComponent implements OnInit, OnChanges {

  @Input() filterType: string;

  @Input() filter: Filter = new Filter();


  tempImg: any;
  imgToUpload: any;
  uploadProgress: any;


  constructor(
    private filtersService: FiltersService,
    private uploadFileService: UploadFileService
    ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.tempImg = null;
  }

  imgSelected( event ) {

    if (event.target.files.length > 0) {
      this.imgToUpload = event.target.files[0];

      const reader = new FileReader();
      const urlImgTemp = reader.readAsDataURL( this.imgToUpload );

      reader.onloadend = () => {
        this.tempImg = reader.result;
      };
    }
  }

  uploadImages() {
    return new Promise( (resolve, reject) => {

      if (this.filterType === 'tipos' || this.filterType === 'rubros') {
        resolve('Image is not necessary');
        return;
      }

      if (!this.imgToUpload && this.filter.imagen) {
        resolve('Image not changed');
        return;
      }

      this.uploadProgress = 'loading';

      this.uploadFileService.uploadFilterImage( this.imgToUpload, this.filterType )
      .subscribe( percentage => {
        this.uploadFileService.downloadUrl.subscribe( url => {
          if (url) {
            this.filter.imagen = url; // Getting download URL
            resolve(percentage);
          }
        });
      });
    });
  }

  uploadFilter() {
    this.uploadImages().then( () => {
      this.filtersService.uploadFilter(this.filter, this.filterType).then( () => {

        sweetAlert(
          'Filtro subido',
          'El filtro se ha subido correctamente',
          'success'
        );

        this.filter = new Filter();
        this.uploadProgress = null;
        this.tempImg = null;

      });
    });
  }

  editFilter() {
    if (!this.filter.nombre) {
      sweetAlert('Error', 'Debes agregar un nombre/titúlo', 'error');
      return;
    }

    this.uploadImages().then( () => {
      this.filtersService.editFilter(this.filter, this.filterType);

      // Waiting response

      const subsribe =
        this.filtersService.filterUploaded.subscribe( res => {
          sweetAlert(
            'Filtro editado',
            'El filtro se ha editado correctamente',
            'success'
          );

          this.filter = new Filter();
          this.uploadProgress = null;
          this.tempImg = null;

          subsribe.unsubscribe();
        } );
      });
  }

}


