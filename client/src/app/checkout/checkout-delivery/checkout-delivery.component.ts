import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { IDeliveryMethod } from './../../shared/models/deliveryMethod';
import { CheckoutService } from './../checkout.service';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})
export class CheckoutDeliveryComponent implements OnInit {
  @Input() checkoutForm: FormGroup;
  deliveryMethods: IDeliveryMethod[];

  constructor(private checkoutService: CheckoutService, private basketService: BasketService) { }

  ngOnInit(): void {
    this.checkoutService.getDeliveryMethods().subscribe(
      dm => this.deliveryMethods = dm,
      error => console.log(error)
    );
  }

  get deliveryForm(): AbstractControl {
    return this.checkoutForm.get("deliveryForm");
  }

  selectDeliveryMethod(deliveryMethod: IDeliveryMethod): void {
    this.basketService.setDeliveryMethod(deliveryMethod);
  }
}
