import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from '../../../../models/user.model';
import { LoadingService } from '../../../shared/loading/loading.service';
import { LoginService } from '../../../../services/login/login.service';

declare var swal;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];

  userToShow: User =  new User();

  constructor(
    private usersService: UsersService,
    private loadingService: LoadingService,
    private loginService: LoginService
  ) {
    this.getUsers();
   }

  ngOnInit() {
  }

  getUsers() {
    this.loadingService.loading = true;

    this.usersService.getUsers().subscribe( (res: any) => {
      this.users = res.users;

      this.loadingService.loading = false;
    } );
  }

  roleChanged(user) {
    if (user._id === this.loginService.user._id) {
      swal({
        title: 'Error',
        text: 'No puedes cambiar tu propio rol!!',
        icon: 'error',
        timer: 2000
      });
      this.getUsers();
      return;
    }

    this.usersService.updateUser(user).subscribe( (res: any) => {
      swal('Rol actualizado', res.message, 'success');

      this.loginService.saveInStorage(this.loginService.user, this.loginService.token);
    } );
  }

  searchUsers( term: string ) {
    if (!term) {
      this.getUsers();
      return;
    }

    this.usersService.getUsersByTerm(term).subscribe( users => {
      this.users = users;
    } );
  }

  setUser(user: User) {
    this.userToShow = user;
    console.log(user);
  }

}
