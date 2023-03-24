import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FetcherService } from '../@core/services/fetcher.service';
import { Api } from '../@core/models/api.enum';
import { IUser } from '../models/user';
import { BehaviorSubject } from 'rxjs';

//After that we write all methods related to consume web in client.service.ts 
@Injectable({
    providedIn: 'root'
})
export class UserService {

  public userDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient,
    private featcher: FetcherService) { }

  autentication(username: string, password: string): Observable<any> {
    return this.featcher.post<any>(Api.autentication, { username: username, password: password }, {}, {}, false)
  }

  getuserDetails() {
    return this.featcher.get<IUser>(Api.userDetails);
  }

  setUserDetailsData(details: any) {
    this.userDetails.next(details); 
  }

  getUserDetailsData() {
    return this.userDetails.asObservable();
  }

}
