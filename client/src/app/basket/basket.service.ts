import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from './../shared/models/basket';
import { IDeliveryMethod } from './../shared/models/deliveryMethod';
import { IProduct } from './../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  apiUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();
  shipping = 0;

  private basketTotalsSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotals$ = this.basketTotalsSource.asObservable();

  constructor(private http: HttpClient) { }

  createPaymentIntent(): Observable<void> {
    return this.http.post(`${this.apiUrl}/payments/${this.getCurrentBasketValue().id}`, {}).pipe(
      map((basket: IBasket) => {
        this.basketSource.next(basket);
      })
    );
  }

  setDeliveryMethod(deliveryMethod: IDeliveryMethod): void {
    this.shipping = deliveryMethod.price;
    this.calculateTotals();

    const basket = this.getCurrentBasketValue();
    basket.deliveryMethodId = deliveryMethod.id;
    basket.shippingPrice = deliveryMethod.price;
    this.setBasket(basket);
  }

  getBasket(basketId: string): Observable<void> {
    return this.http.get<IBasket>(`${this.apiUrl}/basket?id=${basketId}`).pipe(
      map((basket: IBasket) => {
        this.basketSource.next(basket);
        this.shipping = basket.shippingPrice;
        this.calculateTotals();
      })
    );
  }

  setBasket(basket: IBasket): void {
    this.http.post(`${this.apiUrl}/basket`, basket)
      .subscribe((response: IBasket) => {
        this.basketSource.next(response);
        this.calculateTotals();
      }, error => console.log(error));
  }

  deleteBasket(basket: IBasket): void {
    this.http.delete(`${this.apiUrl}/basket?id=${basket.id}`)
      .subscribe(_ => {
        this.basketSource.next(null);
        this.basketTotalsSource.next(null);
        localStorage.removeItem("basket_id");
      }, error => console.log(error));
  }

  deleteLocalBasket(): void {
    this.basketSource.next(null);
    this.basketTotalsSource.next(null);
    localStorage.removeItem("basket_id");
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

  incrementItemQuantity(item: IBasketItem): void {
    const basket = this.getCurrentBasketValue();
    const index = basket.items.findIndex(i => i.id === item.id);
    basket.items[index].quantity++;
    this.setBasket(basket);
  }

  decrementItemQuantity(item: IBasketItem): void {
    const basket = this.getCurrentBasketValue();
    const index = basket.items.findIndex(i => i.id === item.id);

    if (basket.items[index].quantity <= 1) {
      return this.removeItemFromBasket(basket.items[index]);
    }

    basket.items[index].quantity--;
    this.setBasket(basket);
  }

  removeItemFromBasket(item: IBasketItem): void {
    const basket = this.getCurrentBasketValue();
    const index = basket.items.findIndex(i => i.id === item.id);

    basket.items.splice(index, 1);
    if (basket.items.length === 0) {
      return this.deleteBasket(basket);
    }
    this.setBasket(basket);
  }

  private calculateTotals(): void {
    const shipping = this.shipping;
    const basket = this.getCurrentBasketValue();

    const subtotal = basket.items.reduce((sum, item) => item.quantity * item.price + sum, 0);
    const total = shipping + subtotal;

    this.basketTotalsSource.next({ shipping, subtotal, total });
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

  private addOrUpdateItem(items: IBasketItem[], item: IBasketItem, quantity: number): IBasketItem[] {
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
