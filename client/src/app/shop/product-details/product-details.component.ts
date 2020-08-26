import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;
  quantity = 1;

  constructor(private shopService: ShopService,
    private bcService: BreadcrumbService,
    private basketService: BasketService,
    private activatedRoute: ActivatedRoute) {
    this.bcService.set("@productDetail", "");
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.shopService.getProduct(+id).subscribe(response => {
      this.product = response;
      this.bcService.set("@productDetail", this.product.name);
    }, error => {
      console.log(error);
    });
  }

  incrementItemQuantity(): void {
    this.quantity++;
  }

  decrementItemQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addItemToCart(): void {
    this.basketService.addItemToBasket(this.product, this.quantity);
  }
}
