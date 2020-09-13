import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { EditProductComponent } from './edit-product/edit-product.component';

@NgModule({
  declarations: [AdminComponent, EditProductComponent],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
