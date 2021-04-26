import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { UserModel, IdentType } from '../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: UserModel;
  rememberUser = false;
  websocket;

  constructor( private auth: AuthService,
               private router: Router ) { }

  ngOnInit(): void {
    this.user = new UserModel();
    this.user.id = null;
  }


  onSubmit(form: NgForm): any {
    if (form.invalid) {
      return false;
    }

    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor',
      icon: 'info'
    });
    Swal.showLoading();

    this.auth.newUser( this.user ).subscribe( resp => {

      Swal.close();

      if ( this.rememberUser ) {
        localStorage.setItem( 'id', String(this.user.id) );
      }else {
        localStorage.removeItem('id');
      }

      this.router.navigateByUrl('/home');

    }, ( error ) => {

      Swal.fire({
        title: 'Error',
        text: error.error,
        icon: 'error'
      });

    });
  }


}
