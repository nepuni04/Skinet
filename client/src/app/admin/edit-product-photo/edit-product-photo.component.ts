import { Component, OnInit, Input } from '@angular/core';
import { IProduct } from '../../shared/models/product';
import { AdminService } from '../admin.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-product-photo',
  templateUrl: './edit-product-photo.component.html',
  styleUrls: ['./edit-product-photo.component.scss']
})
export class EditProductPhotoComponent implements OnInit {
  @Input() product: IProduct;
  addPhotoMode = false;
  progress = 0;

  constructor(private adminService: AdminService, private toast: ToastrService) { }

  ngOnInit(): void {
  }

  addPhotoModeToggle() {
    this.addPhotoMode = !this.addPhotoMode;
  }

  uploadFile(file: File) {
    this.adminService.uploadPhoto(this.product.id, file).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          break;
        case HttpEventType.Response:
          this.product = event.body;
          setTimeout(() => {
            this.progress = 0;
            this.addPhotoMode = false;
          }, 1500);
      }
    }, error => {
      if (error.errors) {
        this.toast.error(error.errors[0]);
      } else {
        this.toast.error('Problem uploading image');
      }
      this.progress = 0;
    });
  }

  deletePhoto(photoId: number) {
    this.adminService.deletePhoto(this.product.id, photoId).subscribe(() => {
      const photoIndex = this.product.photos.findIndex(x => x.id === photoId);
      this.product.photos.splice(photoIndex, 1);
    }, error => {
      this.toast.error('Problem deleting photo');
      console.log(error);
    });
  }

  setMainPhoto(photoId: number) {
    this.adminService.setMainPhoto(this.product.id, photoId).subscribe((product: IProduct) => {
      this.product = product;
    });
  }
}
