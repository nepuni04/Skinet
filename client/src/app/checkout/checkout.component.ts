import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from './../account/account.service';
import { BasketService } from '../basket/basket.service';
import { IBasketTotals } from '../shared/models/basket';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  basketTotals$: Observable<IBasketTotals>;

  constructor(private fb: FormBuilder,
    private basketService: BasketService,
    private accountService: AccountService) { }

  ngOnInit(): void {
    this.createCheckoutForm();
    this.getAddressFormValue();
    this.basketTotals$ = this.basketService.basketTotals$;
  }

  createCheckoutForm(): void {
    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        street: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required],
        zipcode: [null, Validators.required],
      }),
      deliveryForm: this.fb.group({
        deliveryMethod: [null, Validators.required]
      }),
      paymentForm: this.fb.group({
        nameOnCard: [null, Validators.required]
      })
    });
  }

  getAddressFormValue(): void {
    this.accountService.getUserAddress().subscribe(
      address => {
        if (address) {
          this.addressForm.patchValue(address);
        }
      },
      error => console.log(error)
    );
  }

  get addressForm(): AbstractControl {
    return this.checkoutForm.get("addressForm");
  }

  get deliveryForm(): AbstractControl {
    return this.checkoutForm.get("deliveryForm");
  }

  get paymentForm(): AbstractControl {
    return this.checkoutForm.get("paymentForm");
  }
}
