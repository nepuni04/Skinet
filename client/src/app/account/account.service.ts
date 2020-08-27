import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { IUser } from './../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  getCurrentUserValue(): IUser {
    return this.currentUserSource.value;
  }

  loadCurrentUser(token: string): Observable<void> {
    let headers = new HttpHeaders();
    headers = headers.set("Authorization", `Bearer ${token}`);

    return this.http.get<IUser>(`${this.baseUrl}/account`, { headers })
      .pipe(
        map((user: IUser) => {
          if (user) {
            this.currentUserSource.next(user);
            localStorage.setItem("token", user.token);
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
}
