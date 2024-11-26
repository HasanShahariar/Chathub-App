import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '../../../environment';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtHelper = new JwtHelperService();
  private authLocalStorageToken = `chathub-credential`;
  currentUserSubject: BehaviorSubject<any>;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(undefined);
  }

  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public register(user): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "api/Auth/Register", user);
  }
  
  public authenticate(userInfo): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "api/Auth/Authenticate", userInfo).pipe(

      map((auth: any) => {
        this.currentUserSubject.next(auth);
        const result = this.setAuthFromLocalStorage(auth);
        return auth;
      })
    );
  }

  private setAuthFromLocalStorage(auth: any): boolean {

    if (auth && auth.AccessToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  public getAllUsers(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + "api/Users/GetAll");
  }

  loggedIn() {
    const user = localStorage.getItem(this.authLocalStorageToken);
    return !this.jwtHelper.isTokenExpired(JSON.parse(user)?.AccessToken);
  }

  public getSession(): boolean {
    return this.loggedIn();
  }

  logout() {
    localStorage.removeItem("chathub-credential");
    this.router.navigate([""])
  }

}
