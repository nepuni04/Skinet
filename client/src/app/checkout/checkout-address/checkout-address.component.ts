import { ToastrService } from 'ngx-toastr';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { AccountService } from './../../account/account.service';
import { IAddress } from '../../shared/models/address';

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
      (address: IAddress) => {
        this.toastr.success("Address Successfully Updated");
        this.addressForm.reset(address);
      },
      error => {
        this.toastr.error(error.message);
        console.log(error);
      }
    );
  }

  get addressForm(): AbstractControl {
    return this.checkoutForm.get("addressForm");
  }

  resetFormValidation() {
    this.addressForm.reset(this.addressForm.value);
  }
}
