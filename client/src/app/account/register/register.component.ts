import { Router } from '@angular/router';
import { AccountService } from './../account.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errors: string[];

  constructor(private acountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm(): void {
    this.registerForm = new FormGroup({
      displayName: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required,
      Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]),
      password: new FormControl("", [Validators.required])
    });
  }

  onSubmit(): void {
    this.acountService.register(this.registerForm.value)
      .subscribe(_ => {
        this.router.navigateByUrl("/shop");
      }, error => {
        console.log(error);
        this.errors = error.errors;
      });
  }
}
