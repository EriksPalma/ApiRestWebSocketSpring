import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  user: UserModel = new UserModel();
  rememberUser = false;

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit(): void {

    this.auth.getUsers().subscribe( resp => console.log(resp));

    if (sessionStorage.getItem('id')) {
      this.user.id = sessionStorage.getItem('id');
      this.rememberUser = true;
    }
  }

  login(form: NgForm): any {

    if (form.invalid) {

      return false;
    }

    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor',
      icon: 'info'
    });

    Swal.showLoading();

    this.auth.logIn(this.user)
      .subscribe( resp => {

        Swal.close();

        if ( this.rememberUser ) {
          sessionStorage.setItem( 'id', String(this.user.id) );
        }else {
          sessionStorage.removeItem('id');
        }

        this.router.navigateByUrl('/home');

      }, (error) => {

        if ( error.status === 404 )
        {
          Swal.fire({
            title: 'Error',
            text: 'Combinación de Usuario y contraseña invalidos',
            icon: 'error'
          });

        }else {
          Swal.fire({
            title: 'Error',
            text: error.error,
            icon: 'error'
          });
        }
      });
  }


}
