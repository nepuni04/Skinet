import { AdminService } from './admin.service';
import { ShopService } from './../shop/shop.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IProduct } from '../shared/models/product';
import { ShopParams } from '../shared/models/shopParams';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  products: IProduct[];
  totalCount: number;
  shopParams = new ShopParams();
  @ViewChild("search", { static: false }) searchTerm: ElementRef; 

  constructor(private shopService: ShopService, private adminService: AdminService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.shopService.getProducts(this.shopParams)
      .subscribe(response => {
        this.products = response.data;
        this.totalCount = response.count;
      }, error => console.log(error));
  }

  onPageChanged(event: any): void {
    if (this.shopParams.pageIndex !== event) {
      this.shopParams.pageIndex = event;
      this.getProducts();
    }
  }

  deleteProduct(id: number): void {
    if (!confirm("Are you sure you want to delete this?")) return

    this.adminService.deleteProduct(id).subscribe(_ => {
      this.products.splice(this.products.findIndex(p => p.id === id), 1);
      this.totalCount--;
    }, error => console.log(error));
  }

  onSearch() {
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.shopParams.pageIndex = 1;
    this.getProducts();
  }

  onReset() {
    this.searchTerm.nativeElement.value = "";
    this.shopParams = new ShopParams();
    this.getProducts();
  }
}
