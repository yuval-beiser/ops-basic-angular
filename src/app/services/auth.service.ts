import {Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService  {
  constructor() { }

  public setAuthenticated(isAuth:boolean):void {

  }
  public isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');
    return !!token;
  }
}
