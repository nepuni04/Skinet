import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from './../../shared/models/basket';
import { IOrderToCreate, IOrder } from './../../shared/models/order';
import { CheckoutService } from './../checkout.service';

declare var Stripe;

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
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
  loading = false;
  cardNumberValid = false;
  cardExpiryValid = false;
  cardCvcValid = false;

  constructor(
    private router: Router,
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService) { }

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

  ngOnDestroy(): void {
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }

  onChange(event) {
    if (event.error) {
      this.cardErrors = event.error.message;
    } else {
      this.cardErrors = null;
    }

    switch (event.elementType) {
      case "cardNumber":
        this.cardNumberValid = event.complete
        break;
      case "cardExpiry":
        this.cardExpiryValid = event.complete
        break;
      case "cardCvc":
        this.cardCvcValid = event.complete
        break;
    }
  }

  async onSubmitOrder(): Promise<void> {
    this.loading = true;
    const basket = this.basketService.getCurrentBasketValue();
    try {
      const createdOrder = await this.createOrder(basket);
      const paymentResult = await this.confirmPaymentWithStripe(basket);

      if (paymentResult.paymentIntent) {
        this.basketService.deleteBasket(basket);
        const navExtras: NavigationExtras = { state: createdOrder };
        this.router.navigate(["/checkout/success"], navExtras);
      }
      else {
        console.log(paymentResult.error.message)
        this.toastr.error(paymentResult.error.message);
      }
      this.loading = false;
    }
    catch (error) {
      this.loading = false;
      console.log(error);
    }
  }

  private confirmPaymentWithStripe(basket: IBasket): Promise<any> {
    return this.stripe.confirmCardPayment(basket.clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.paymentForm.get('nameOnCard').value
        }
      },
      shipping: {
        address: {
          line1: this.addressForm.get('street').value,
          city: this.addressForm.get('city').value,
          state: this.addressForm.get("state").value,
          postal_code: this.addressForm.get('zipcode').value
        },
        name: `${this.addressForm.get('firstName').value} ${this.addressForm.get('lastName').value}`
      }
    });
  }

  private getOrderToCreate(basket: IBasket): IOrderToCreate {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.deliveryForm.get("deliveryMethod").value,
      shipToAddress: this.addressForm.value
    };
  }

  private createOrder(basket: IBasket): Promise<IOrder> {
    const orderToCreate = this.getOrderToCreate(basket);
    return this.checkoutService.createOrder(orderToCreate).toPromise();
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
