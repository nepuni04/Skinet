import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';
import { Route, RouterModule } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { NgModule } from '@angular/core';

const routes: Route[] = [
  { path: "", component: CheckoutComponent },
  { path: "success", component: CheckoutSuccessComponent }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CheckoutRoutingModule { }
