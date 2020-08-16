import { ShopParams } from './../shared/models/shopParams';
import { IBrand } from './../shared/models/brand';
import { IType } from './../shared/models/productType';
import { IPagination } from './../shared/models/pagination';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = "https://localhost:5001/api";

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

  getBrands(): Observable<IBrand[]> {
    return this.http.get<IBrand[]>(`${this.baseUrl}/products/brands`);
  }

  getTypes(): Observable<IType[]> {
    return this.http.get<IType[]>(`${this.baseUrl}/products/types`);
  }
}
