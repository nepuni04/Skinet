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

  constructor() { }

  ngOnInit(): void {
  }
}
