import { ToastrService } from 'ngx-toastr';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { AccountService } from './../../account/account.service';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})
export class CheckoutAddressComponent implements OnInit {
  @Input() checkoutForm: FormGroup;

  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  updateUserAddress(): void {
    this.accountService.updateUserAddress(this.addressForm.value).subscribe(
      _ => this.toastr.success("Address Successfully Updated"),
      error => {
        this.toastr.error(error.message);
        console.log(error);
      }
    );
  }

  get addressForm(): AbstractControl {
    return this.checkoutForm.get("addressForm");
  }
}
