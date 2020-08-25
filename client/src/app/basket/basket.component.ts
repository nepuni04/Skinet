import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket.service';
import { IBasket } from '../shared/models/basket';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
  }

}
