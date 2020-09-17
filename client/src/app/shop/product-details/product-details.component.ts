import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';
import { BasketService } from 'src/app/basket/basket.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryImageSize } from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;
  quantity = 1;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

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
      this.initializeGallery();
    }, error => {
      console.log(error);
    });
  }

  initializeGallery() {
    this.galleryOptions = [
      {
        width: '500px',
        height: '400px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        arrowPrevIcon: 'fa fa-chevron-left',
        arrowNextIcon: 'fa fa-chevron-right',
        imageAnimation: NgxGalleryAnimation.Fade,
        imageSize: NgxGalleryImageSize.Contain,
        thumbnailSize: NgxGalleryImageSize.Contain,
        preview: false
      }
    ];
    this.galleryImages = this.getImages();
  }

  getImages() {
    const imageUrls = [];
    for (const photo of this.product.photos) {
      imageUrls.push({
        small: photo.pictureUrl,
        medium: photo.pictureUrl,
        big: photo.pictureUrl,
      });
    }
    return imageUrls;
  }

  addItemToCart(): void {
    this.basketService.addItemToBasket(this.product, this.quantity);
  }

  incrementItemQuantity(): void {
    this.quantity++;
  }

  decrementItemQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
