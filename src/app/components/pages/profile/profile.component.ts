import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';
import { LoadingService } from '../../shared/loading/loading.service';
import { User } from '../../../models/user.model';

declare var swal;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User = new User();

  constructor(
    private loginService: LoginService,
    private loadingService: LoadingService
  ) {
    if (this.loginService.user && this.loginService.token) {
      this.user = this.loginService.user;
      this.loadingService.loading = false;
    }
   }

  ngOnInit() {
  }

  updateUser() {
    this.loginService.updateUser(this.user).subscribe( (res: any) => {
      this.loginService.saveInStorage(this.user, this.loginService.token);
      swal('Usuario actualizado', res.message, 'success');
    } );
  }

}
