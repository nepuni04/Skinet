import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductFormValues } from '../../shared/models/product';
import { IBrand } from '../../shared/models/brand';
import { IType } from '../../shared/models/productType';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './edit-product-form.component.html',
  styleUrls: ['./edit-product-form.component.scss']
})
export class EditProductFormComponent implements OnInit {
  @Input() product: ProductFormValues;
  @Input() brands: IBrand[];
  @Input() types: IType[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private adminService: AdminService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.route.snapshot.url[0].path === 'edit') {
      const updatedProduct = { ...this.product, price: +this.product.price }
      this.adminService.updateProduct(+this.route.snapshot.paramMap.get('id'), updatedProduct)
        .subscribe(
          response => this.router.navigate(["/admin"]),
          error => console.log(error)
        );
    }
    else {
      const newProduct = { ...this.product, price: +this.product.price };
      this.adminService.createProduct(newProduct).subscribe(
        response => this.router.navigate(["/admin"]),
        error => console.log(error)
      );
    }
  }

  updatePrice(event: number): void {
    this.product.price = event;
  }
}
