import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) {}


  public register(user): Observable<any> {
    return this.http.post<any>(environment.apiUrl+"api/Auth/Register",user);
  }
  public authenticate(userInfo): Observable<any> {
    
    return this.http.post<any>(environment.apiUrl+"api/Auth/Authenticate",userInfo);
  }

  public getAllUsers(): Observable<any> {
    return this.http.get<any>(environment.apiUrl+"api/Users/GetAll");
  }

}
