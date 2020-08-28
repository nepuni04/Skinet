import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AccountService } from './../account.service';

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
      email: new FormControl("",
        [
          Validators.required,
          Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
        ],
        [this.validateEmailNotTaken()]
      ),
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

  validateEmailNotTaken(): AsyncValidatorFn {
    return control => {
      return timer(600).pipe(
        switchMap(() => {
          if (!control.value) {
            return of(null);
          }
          return this.acountService.checkEmailExists(control.value).pipe(
            map(exists => {
              return exists ? { emailExists: true } : null;
            })
          );
        })
      );
    };
  }
}
