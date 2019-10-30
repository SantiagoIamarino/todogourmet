import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  marca: any = {
    imagen: '',
    url: ''
  };

  filter: any = {
    nombre: '',
    filterName: '',
    img: ''
  };

  filterType: string;

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ) {
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

  ngOnInit() {
  }

  uploadMarca() {
    this.adminService.uploadMarca( this.marca ).then( res =>{
      console.log(res);
      this.marca = {
        imagen: '',
        url: ''
      };
    } );
  }

  uploadFilter() {
    this.adminService.uploadFilter( this.filter, this.filterType ).then( res => {
      console.log(res);
      this.filter = {
        nombre: '',
        filterName: ''
      };
    } );
  }

}
