import {Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinerService {

  public dataObsevable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor() {
  }

  setSpinerEvent(isLoading: boolean) {
    this.dataObsevable.next(isLoading); 
  }

  getEventListner() {
    return this.dataObsevable.asObservable();
  } 

}
