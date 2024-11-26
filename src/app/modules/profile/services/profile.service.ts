import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private http: HttpClient,
  ) {
  
  }


  public updateUser(user): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "api/Users/UpdateUser", user);
  }

}
