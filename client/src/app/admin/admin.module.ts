import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { EditProductFormComponent } from './edit-product-form/edit-product-form.component';
import { EditProductPhotoComponent } from './edit-product-photo/edit-product-photo.component';

@NgModule({
  declarations: [
    AdminComponent,
    EditProductComponent,
    EditProductFormComponent,
    EditProductPhotoComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
