import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { IDeliveryMethod } from './../shared/models/deliveryMethod';
import { IOrder, IOrderToCreate } from './../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDeliveryMethods(): Observable<IDeliveryMethod[]> {
    return this.http.get<IDeliveryMethod[]>(`${this.baseUrl}/orders/deliveryMethods`)
      .pipe(
        map((dm: IDeliveryMethod[]) => {
          return dm.sort((a, b) => b.price - a.price);
        })
      );
  }

  createOrder(orderToCreate: IOrderToCreate): Observable<IOrder> {
    return this.http.post<IOrder>(`${this.baseUrl}/orders`, orderToCreate);
  }
}
