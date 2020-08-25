import { BasketService } from './basket/basket.service';
import { ShopService } from './shop/shop.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPagination } from './shared/models/pagination';
import { IProduct } from './shared/models/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Skinet';

  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    this.loadBasket();
  }

  loadBasket(): void {
    const basketId = localStorage.getItem("basket_id");
    if (basketId) {
      this.basketService.getBasket(basketId).subscribe(
        () => console.log("Basket Initialized"),
        error => console.log(error));
    }
  }
}
