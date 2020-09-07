import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from './../../shared/models/basket';
import { IOrderToCreate } from './../../shared/models/order';
import { CheckoutService } from './../checkout.service';

declare var Stripe;

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit, AfterViewInit {
  @Input() checkoutForm: FormGroup;
  @ViewChild('cardNumber', { static: true }) cardNumberElement: ElementRef;
  @ViewChild('cardExpiry', { static: true }) cardExpiryElement: ElementRef;
  @ViewChild('cardCvc', { static: true }) cardCvcElement: ElementRef;

  stripe: any;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardErrors: any;
  cardHandler = this.onChange.bind(this);

  constructor(
    private router: Router,
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.stripe = Stripe("pk_test_51HMur8DQpLyuEGmoOcBF7NiEH6xaJvQePpqrhw3Hpo3zIDZKerMuYJkOBrqXQgoza8ENFm9FGN4uG7CeewuKqzOf003wVsbSBi");
    const elements = this.stripe.elements();

    this.cardNumber = elements.create("cardNumber");
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);

    this.cardExpiry = elements.create("cardExpiry");
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change', this.cardHandler);

    this.cardCvc = elements.create("cardCvc");
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change', this.cardHandler);
  }

  onChange(event) {
    if (event.error) {
      this.cardErrors = event.error.message;
    } else {
      this.cardErrors = null;
    }
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
