import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  constructor(
    public loginService: LoginService
  ) { }

  ngOnInit() {
  }

}
