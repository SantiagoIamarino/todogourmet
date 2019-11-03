import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FiltersService } from './filters.service';
import { Filter } from '../../../../models/filter.model';
import { UploadFileService } from '../../../../services/upload-file.service';

declare function closeEditModal( modalId );

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['../productos/productos.component.css', './filters.component.css']
})
export class FiltersComponent implements OnInit {

  filters: Filter[] = [];

  filterType: string;
  filter: Filter = new Filter();

  filterToEdit: any;

  loading = false;

  constructor(
    private adminService: AdminService,
    private filtersService: FiltersService,
    private uploadFileService: UploadFileService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.redirectIfIsIncorretType();
   }

  ngOnInit() {
  }

  redirectIfIsIncorretType() {
    this.route.paramMap.subscribe( params => {
      this.filterType =  params.get('tipo');
      this.getFilters(this.filterType);

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

  searchFilters( term: string, event ) {
    if (term) {
      this.loading = true;

      this.filtersService.searchfilters(term, this.filterType)
        .subscribe( (results: any) => {
          this.filters = results;
          this.loading = false;
        } );

    } else {
      this.getFilters(this.filterType);
    }
  }

  openEditModal( filter ) {
    this.filterToEdit = null;
    this.filterToEdit = filter;

    const listener =
      this.filtersService.filterUploaded.subscribe( res => {
        listener.unsubscribe();
        this.filterToEdit = null;
        closeEditModal('editFilter');
      } );

  }

  deleteFilter( filter: Filter ) {

    sweetAlert('Estas seguro que deseas eliminar esto?', {
      buttons: ['Cancelar', 'Aceptar'],
      icon: 'warning'
    }).then( wantsToDelete => {
      if (wantsToDelete) {
        this.filtersService.deleteFilter( filter, this.filterType );

        const listener =
          this.filtersService.filterDeleted.subscribe( res => {
            sweetAlert(
              'Filtro eliminado',
              'El filtro se ha subido correctamente',
              'success'
            );
          });
      }
    } );
  }

}
