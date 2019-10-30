import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../../../services/admin.service';

declare function loadScript();
declare function destroyScript();

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  marca: any = {
    imagen: '',
    url: ''
  };

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
    loadScript();
  }

  ngOnDestroy() {
    destroyScript();
  }

}
