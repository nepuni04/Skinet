import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from '../shared/models/product';
import { environment } from './../../environments/environment';
import { IBrand } from './../shared/models/brand';
import { IPagination } from './../shared/models/pagination';
import { IType } from './../shared/models/productType';
import { ShopParams } from './../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProducts(shopParams: ShopParams): Observable<IPagination> {
    let params = new HttpParams();

    if (shopParams.brandId !== 0) {
      params = params.append('brandId', shopParams.brandId.toString());
    }

    if (shopParams.typeId !== 0) {
      params = params.append('typeId', shopParams.typeId.toString());
    }

    if (shopParams.search) {
      params = params.append("search", shopParams.search);
    }

    params = params.append("pageIndex", shopParams.pageIndex.toString());
    params = params.append("pageSize", shopParams.pageSize.toString());
    params = params.append("sort", shopParams.sort.toString());

    return this.http.get<IPagination>(`${this.baseUrl}/products`, {
      params
    });
  }

  getProduct(productId: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.baseUrl}/products/${productId}`);
  }

  getBrands(): Observable<IBrand[]> {
    return this.http.get<IBrand[]>(`${this.baseUrl}/products/brands`);
  }

  getTypes(): Observable<IType[]> {
    return this.http.get<IType[]>(`${this.baseUrl}/products/types`);
  }
}
