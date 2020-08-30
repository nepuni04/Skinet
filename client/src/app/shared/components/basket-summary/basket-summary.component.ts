import { IBasketItem } from './../../models/basket';
import { Observable } from 'rxjs';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from '../../models/basket';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit {
  basket$: Observable<IBasket>;
  @Input() isBasket = true;
  @Output() increment = new EventEmitter<IBasketItem>();
  @Output() decrement = new EventEmitter<IBasketItem>();
  @Output() remove = new EventEmitter<IBasketItem>();

  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
  }

  decrementItemQuantity(item: IBasketItem): void {
    this.decrement.emit(item);
  }

  incrementItemQuantity(item: IBasketItem): void {
    this.increment.emit(item);
  }

  removeBasketItem(item: IBasketItem): void {
    this.remove.emit(item);
  }
}
