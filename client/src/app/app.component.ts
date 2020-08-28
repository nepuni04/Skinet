import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';
import { BasketService } from './basket/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Skinet';

  constructor(private basketService: BasketService,
    private accountService: AccountService) { }

  ngOnInit(): void {
    this.loadCurrentUser();
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

  loadCurrentUser(): void {
    const token = localStorage.getItem("token");
    this.accountService.loadCurrentUser(token).subscribe(
      () => console.log("Checked For Current User"),
      error => console.log(error));
  }
}
