import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }
  private showProfile = new BehaviorSubject<boolean>(false); // Default value

  public showProfileSubject$ = this.showProfile.asObservable();

  updateValue(newValue: boolean) {
    this.showProfile.next(newValue);
  }
}
