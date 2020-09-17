import { Observable } from 'rxjs';
import { ProductFormValues, IProduct } from './../shared/models/product';
import { HttpClient, HttpEvent } from '@angular/common/http';
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

  uploadPhoto(productId: number, file: File): Observable<HttpEvent<any>> {
    let formData = new FormData();
    formData.append("photo", file, "image.png")

    return this.http.put(`${this.baseUrl}/products/${productId}/photo`, formData, {
      reportProgress: true,
      observe: "events"
    });
  }

  deletePhoto(productId: number, photoId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/${productId}/photo/${photoId}`)
  }

  setMainPhoto(productId: number, photoId: number): Observable<IProduct> {
    return this.http.post<IProduct>(`${this.baseUrl}/products/${productId}/photo/${photoId}`, {});
  }
}
