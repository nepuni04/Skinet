import { IProduct } from './../shared/models/product';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { IBasket, Basket, IBasketItem } from './../shared/models/basket';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  apiUrl = environment.apiUrl;
  basketSource = new BehaviorSubject(null);
  basket$ = this.basketSource.asObservable();

  constructor(private http: HttpClient) { }

  getBasket(basketId: string): Observable<void> {
    return this.http.get<IBasket>(`${this.apiUrl}/basket?id=${basketId}`).pipe(
      map((basket: IBasket) => {
        this.basketSource.next(basket);
      })
    );
  }

  setBasket(basket: IBasket): void {
    this.http.post(`${this.apiUrl}/basket`, basket)
      .subscribe((response: IBasket) => {
        this.basketSource.next(response);
      }, error => console.log(error));
  }

  getCurrentBasketValue(): IBasket {
    return this.basketSource.value;
  }

  addItemToBasket(product: IProduct, quantity = 1): void {
    const item = this.mapProductToBasketItem(product, quantity);

    let basket = this.getCurrentBasketValue();
    if (basket == null) {
      basket = this.createBasket();
    }

    basket.items = this.addOrUpdateItem(basket.items, item, quantity);
    this.setBasket(basket);
  }

  private mapProductToBasketItem(product: IProduct, quantity: number): IBasketItem {
    return {
      id: product.id,
      productName: product.name,
      price: product.price,
      quantity,
      pictureUrl: product.pictureUrl,
      brand: product.productBrand,
      type: product.productBrand,
    };
  }

  private addOrUpdateItem(items: IBasketItem[], item: IBasketItem, quantity: number): import("../shared/models/basket").IBasketItem[] {
    const index = items.findIndex(i => i.id === item.id);
    if (index === -1) {
      items.push(item);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem("basket_id", basket.id);

    return basket;
  }
}
