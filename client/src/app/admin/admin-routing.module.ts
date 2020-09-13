import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { EditProductComponent } from './edit-product/edit-product.component';

const routes: Route[] = [
  { path: "", component: AdminComponent },
  { path: "create", component: EditProductComponent, data: { breadcrumb: "Create" } },
  { path: "edit/:id", component: EditProductComponent, data: { breadcrumb: "Edit" } }
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
export class AdminRoutingModule { }
