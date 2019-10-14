import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  marca: any = {
    imagen: '',
    url: ''
  }

  constructor(
    private adminService: AdminService
  ) { }

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

}
