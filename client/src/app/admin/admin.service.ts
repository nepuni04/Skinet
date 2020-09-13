import { Observable } from 'rxjs';
import { ProductFormValues } from './../shared/models/product';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createProduct(product: ProductFormValues): Observable<any> {
    return this.http.post(`${this.baseUrl}/products`, product);
  }

  updateProduct(id: number, product: ProductFormValues): Observable<any> {
    return this.http.put(`${this.baseUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/${id}`);
  }
}
