import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
declare var SockJS;
declare var Stomp;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public url = 'http://localhost:8080/api';
  userToken: string;
  public stompClient;
  public msg = [];

  constructor( private http: HttpClient ) {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection(): any {
    const serverUrl = 'http://localhost:8080/ws';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, (frame) => {
      that.stompClient.subscribe('/topic', (message) => {
        if (message) {
          that.msg.push(message);
          console.log(message);
        }
      });
    });
  }

  sendMessage(): void {
    this.stompClient.send('/app/usuarios' , {}, 'update');
  }


  logIn(user: UserModel): any {
    const authData = {
      ...user,
      returnSecureToken: true
    };

    return this.http.post(
      `${this.url}/usuarios/login`,
      authData
    ).pipe(
      map( resp => {
        this.saveToken( resp['id'] );
        return resp;
      })
    );

  }

  newUser(newUser: UserModel): any {
    const authData = {
      ...newUser
    };

    return this.http.post(
      `${this.url}/usuarios`,
      authData
    ).pipe(
      map( resp => {
        this.sendMessage();
        this.saveToken( resp['id'] );
        return resp;
      })
    );
  }

  private saveToken( idToken: string ): void {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    const TODAY = new Date();
    TODAY.setSeconds(3600);

    localStorage.setItem('expires', TODAY.getTime().toString());

  }

  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
    this.userToken = '';

  }

  isAutenticated(): boolean  {

    if ( this.userToken ){
      if (this.userToken.length < 2) {
        return false;
      }
    }

    const EXPIRES = Number(localStorage.getItem('expires'));
    const EXPIRESDATE = new Date();
    EXPIRESDATE.setTime(EXPIRES);

    if (EXPIRESDATE > new Date() ){
      return true;
    } else{
      return false;
    }

  }

  getUsers(): Observable<any>{

    return this.http.get(`${this.url}/usuarios`);
  }

  deleteUser( id: string ): Observable<UserModel> {

    return this.http.delete< UserModel >(`${this.url}/usuarios/${id}` );
  }

  editUser( user: UserModel ): Observable<any> {

    return this.http.put(`${this.url}/usuarios/${user.id}`, user );
  }

}
