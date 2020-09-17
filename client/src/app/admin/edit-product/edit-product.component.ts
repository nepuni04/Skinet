import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { IBrand } from 'src/app/shared/models/brand';
import { ProductFormValues, IProduct } from './../../shared/models/product';
import { IType } from './../../shared/models/productType';
import { ShopService } from './../../shop/shop.service';
import { AdminService } from './../admin.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  product: IProduct;
  productFormValues: ProductFormValues;
  brands: IBrand[];
  types: IType[];

  constructor(private shopService: ShopService,
    private route: ActivatedRoute) {
    this.productFormValues = new ProductFormValues();
  }

  ngOnInit(): void {
    const types$ = this.getTypes();
    const brands$ = this.getBrands();

    forkJoin([types$, brands$]).subscribe(
      result => {
        this.types = result[0];
        this.brands = result[1];
      },
      error => console.log(error),
      () => {
        if (this.route.snapshot.url[0].path === "edit") {
          this.loadProduct();
        }
      });
  }

  loadProduct(): void {
    this.shopService.getProduct(+this.route.snapshot.paramMap.get("id"))
      .subscribe(response => {
        const productBrandId = this.brands && this.brands.find(x => x.name === response.productBrand).id;
        const productTypeId = this.types && this.types.find(x => x.name === response.productType).id;

        this.product = response;
        this.productFormValues = { ...response, productBrandId, productTypeId };
      });
  }

  getTypes(): Observable<IType[]> {
    return this.shopService.getTypes();
  }

  getBrands(): Observable<IBrand[]> {
    return this.shopService.getBrands();
  }
}
