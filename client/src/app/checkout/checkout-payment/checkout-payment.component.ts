import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from './../../shared/models/basket';
import { IOrderToCreate } from './../../shared/models/order';
import { CheckoutService } from './../checkout.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm: FormGroup;

  constructor(
    private router: Router,
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  onSubmitOrder(): void {
    const basket = this.basketService.getCurrentBasketValue();
    this.checkoutService.createOrder(this.getOrderToCreate(basket))
      .subscribe(
        order => {
          this.basketService.deleteLocalBasket();
          this.toastr.success("Order Successfully Created");
          const navExtras: NavigationExtras = { state: order };
          this.router.navigate(["/checkout/success"], navExtras);
        },
        error => console.log(error)
      );
  }

  private getOrderToCreate(basket: IBasket): IOrderToCreate {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.deliveryForm.get("deliveryMethod").value,
      shipToAddress: this.addressForm.value
    };
  }

  private get addressForm(): AbstractControl {
    return this.checkoutForm.get("addressForm");
  }

  private get deliveryForm(): AbstractControl {
    return this.checkoutForm.get("deliveryForm");
  }
}
