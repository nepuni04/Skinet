import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBasketItem } from './../../models/basket';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit {
  @Input() isBasket = true;
  @Input() items: IBasketItem[];
  @Output() increment = new EventEmitter<IBasketItem>();
  @Output() decrement = new EventEmitter<IBasketItem>();
  @Output() remove = new EventEmitter<IBasketItem>();

  constructor() { }

  ngOnInit(): void {
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
