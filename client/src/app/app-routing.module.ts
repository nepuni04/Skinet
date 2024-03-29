import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './core/guards/admin.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { TestErrorComponent } from './core/test-error/test-error.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: "", component: HomeComponent, data: { breadcrumb: 'Home' } },
  {
    path: "shop",
    loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule),
    data: { breadcrumb: 'Shop' }
  },
  {
    path: "basket",
    loadChildren: () => import('./basket/basket.module').then(m => m.BasketModule),
    data: { breadcrumb: 'Basket' }
  },
  {
    path: "checkout",
    loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule),
    data: { breadcrumb: 'Checkout' },
    canActivate: [AuthGuard]
  },
  {
    path: "orders",
    loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
    data: { breadcrumb: 'Orders' },
    canActivate: [AuthGuard]
  },
  {
    path: "account",
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
    data: { breadcrumb: { skip: true } }
  },
  {
    path: "admin",
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    data: { breadcrumb: "Admin" },
    canActivate: [
      AuthGuard,
      AdminGuard
    ]
  },
  {
    path: "test-error",
    component: TestErrorComponent,
    data: { breadcrumb: 'Test Error' }
  },
  {
    path: "not-found",
    component: NotFoundComponent,
    data: { breadcrumb: 'Not Found' }
  },
  {
    path: "server-error",
    component: ServerErrorComponent,
    data: { breadcrumb: 'Server Error' }
  },
  { path: "**", redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
