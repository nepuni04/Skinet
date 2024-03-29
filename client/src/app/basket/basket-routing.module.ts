import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { BasketComponent } from './basket.component';

const routes: Route[] = [
  { path: "", component: BasketComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class BasketRoutingModule { }
