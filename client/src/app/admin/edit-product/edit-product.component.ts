import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { IBrand } from 'src/app/shared/models/brand';
import { ProductFormValues } from './../../shared/models/product';
import { IType } from './../../shared/models/productType';
import { ShopService } from './../../shop/shop.service';
import { AdminService } from './../admin.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  product: ProductFormValues;
  brands: IBrand[];
  types: IType[];

  constructor(private adminService: AdminService,
    private shopService: ShopService,
    private router: Router,
    private route: ActivatedRoute) {
    this.product = new ProductFormValues();
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

  onSubmit(product: ProductFormValues): void {
    if (this.route.snapshot.url[0].path === 'edit') {
      const updatedProduct = { ...this.product, product, price: +product.price }
      this.adminService.updateProduct(+this.route.snapshot.paramMap.get('id'), updatedProduct)
        .subscribe(response => {
          this.router.navigate(["/admin"]);
        }, error => console.log(error));
    }
    else {
      const newProduct = { ...product, price: +product.price };
      this.adminService.createProduct(newProduct).subscribe(
        response => this.router.navigate(["/admin"]),
        error => console.log(error)
      );
    }
  }

  updatePrice(event: number): void {
    this.product.price = event;
  }

  loadProduct(): void {
    this.shopService.getProduct(+this.route.snapshot.paramMap.get("id"))
      .subscribe(response => {
        const productBrandId = this.brands && this.brands.find(x => x.name === response.productBrand).id;
        const productTypeId = this.types && this.types.find(x => x.name === response.productType).id;
        this.product = { ...response, productBrandId, productTypeId };
      });
  }

  getTypes(): Observable<IType[]> {
    return this.shopService.getTypes();
  }

  getBrands(): Observable<IBrand[]> {
    return this.shopService.getBrands();
  }
}
