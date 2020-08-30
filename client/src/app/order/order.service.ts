import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { IOrder } from './../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUserOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.baseUrl}/orders`);
  }

  getOrderById(id: number): Observable<IOrder> {
    return this.http.get<IOrder>(`${this.baseUrl}/orders/${id}`);
  }
}
