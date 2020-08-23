import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { IBasket } from './../shared/models/basket';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  apiUrl = environment.apiUrl;
  basketSource = new BehaviorSubject(null);
  basket$ = this.basketSource.asObservable();

  constructor(private http: HttpClient) { }

  getBasket(basketId: string): Observable<void> {
    return this.http.get<IBasket>(`${this.apiUrl}/basket`).pipe(
      map((basket: IBasket) => {
        this.basketSource.next(basket);
      })
    );
  }

  setBasket(basket: IBasket): Observable<void> {
    return this.http.post(`${this.apiUrl}/basket`, basket).pipe(
      map((response: IBasket) => {
        this.basketSource.next(response);
      })
    );
  }

  getCurrentBasketValue(): IBasket {
    return this.basketSource.value;
  }
}
