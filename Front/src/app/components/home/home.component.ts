import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserModel, IdentType } from '../../models/user.model';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
declare var SockJS;
declare var Stomp;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [],
})
export class HomeComponent implements OnInit {

  user: UserModel;
  usuarios: UserModel[];
  public stompClient;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
      this.auth.getUsers().subscribe( (respUser ) => {
      this.usuarios = respUser;
      });

      this.initializeWebSocketConnection();
  }

  sendMessage(): void {
    this.stompClient.send('/app/usuarios' , {}, 'update');
  }

  initializeWebSocketConnection(): any {
    const serverUrl = 'http://localhost:8080/ws';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    return this.stompClient.connect({}, (frame) => {
      that.stompClient.subscribe('/topic', (resp ) => {
        if (resp) {
          this.usuarios = (JSON.parse(resp.body));
        }
      });
    });
  }

  logOut(): void {
    this.auth.logOut();
    this.router.navigateByUrl('/login');
  }

  onSubmit(form: NgForm): any {

    if ( form.valid ){
      this.auth.editUser( form.value ).subscribe(
        resp => {

          this.sendMessage();

          const index = this.usuarios.findIndex( u => u.id === this.user.id );
          this.usuarios[index] = form.value;

          Swal.fire({
            title: 'Usuario Actualizado',
            text: form.value.nombre,
            icon: 'success'
          });
        }, ( error ) => {
          console.log(error);

          Swal.fire({
            title: 'Error',
            text: error,
            icon: 'error'
          });

        });
    }

  }

  register(): void{
    this.router.navigateByUrl('/register');
  }

  setModal(content: UserModel ): void {

    this.user = content;
  }

  deleteUser(id: string): void {

    this.auth.deleteUser(id).subscribe(
      resp => {

        this.sendMessage();

        const index = this.usuarios.findIndex( u => u.id === resp.id );
        this.usuarios.splice( index, 1 );
        Swal.fire({
          title: 'Usuario eliminado',
          text: resp.firstName + resp.lastName,
          icon: 'success'
        });
      }, ( error ) => {
        console.log(error);

        Swal.fire({
          title: 'Error',
          text: error.error.title,
          icon: 'error'
        });

      });
  }
}
