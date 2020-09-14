import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { IAddress } from './../shared/models/address';
import { IUser } from './../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();

  private isAdminSource = new ReplaySubject<boolean>(1);
  isAdmin$ = this.isAdminSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  loadCurrentUser(token: string): Observable<void> {
    if (!token) {
      this.currentUserSource.next(null);
      return of(null);
    }

    let headers = new HttpHeaders();
    headers = headers.set("Authorization", `Bearer ${token}`);

    return this.http.get<IUser>(`${this.baseUrl}/account`, { headers })
      .pipe(
        map((user: IUser) => {
          if (user) {
            this.currentUserSource.next(user);
            localStorage.setItem("token", user.token);
            this.isAdminSource.next(this.isAdmin(user.token));
          }
        })
      );
  }

  login(formValue: any): Observable<void> {
    return this.http.post<IUser>(`${this.baseUrl}/account/login`, formValue)
      .pipe(
        map((user: IUser) => {
          if (user) {
            this.currentUserSource.next(user);
            localStorage.setItem("token", user.token);
            this.isAdminSource.next(this.isAdmin(user.token));
          }
        })
      );
  }

  register(formValue): Observable<void> {
    return this.http.post<IUser>(`${this.baseUrl}/account/register`, formValue)
      .pipe(
        map((user: IUser) => {
          if (user) {
            this.currentUserSource.next(user);
            localStorage.setItem("token", user.token);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem("token");
    this.currentUserSource.next(null);
    this.router.navigateByUrl("/");
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/account/emailexists?email=${email}`);
  }

  getUserAddress(): Observable<IAddress> {
    return this.http.get<IAddress>(`${this.baseUrl}/account/address`);
  }

  updateUserAddress(address: IAddress): Observable<IAddress> {
    return this.http.put<IAddress>(`${this.baseUrl}/account/address`, address);
  }

  isAdmin(token: string): boolean {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      if (decodedToken.role.indexOf("Admin") > -1) {
        return true;
      }
    }
    return false;
  }
}
