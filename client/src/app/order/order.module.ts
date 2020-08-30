import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';

@NgModule({
  declarations: [OrderComponent, OrderDetailComponent],
  imports: [
    SharedModule,
    OrderRoutingModule
  ]
})
export class OrderModule { }
