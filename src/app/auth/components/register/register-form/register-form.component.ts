import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { getAuthStatus } from '../../../reducers/selectors';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit, OnDestroy {
  signUpForm: FormGroup;
  formSubmit = false;
  registerSubs: Subscription;
  returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  private pushErrorFor(ctrl_name: string, msg: string) {
    this.signUpForm.controls[ctrl_name].setErrors({'msg': msg});
  }

  ngOnInit() {
    this.initForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  initForm() {
    const email = '';
    const password = '';
    const password_confirmation = '';
    const mobile = '';
    const gender = '';

    this.signUpForm = this.fb.group({
     'email': [email, Validators.compose([Validators.required, Validators.email]) ],
      'password': [password, Validators.compose([Validators.required, Validators.minLength(6)]) ],
      'password_confirmation': [password_confirmation, Validators.compose([Validators.required, Validators.minLength(6)]) ],
      'mobile': [mobile, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]{10}')]) ],
      'gender': [gender, Validators.required],
      'prefix': ['+63', Validators.required]

    }, {validator: this.matchingPasswords('password', 'password_confirmation')});
  }

  onSubmit() {
    const values = this.signUpForm.value;
    const keys = Object.keys(values);
    this.formSubmit = true;
    const data = {
      'username': values.email,
      'email': values.email,
      'password': values.password,
      'uiid': '',
      'mobileNumber' : values.prefix+" "+values.mobile,
      'gender': values.gender,
      'lastName': values.last_name || '',
      'firstName': values.first_name || ''
    };
    if (this.signUpForm.valid) {
      this.registerSubs = this.authService.register(data).subscribe(data => {
        const error = data.error;
        if (error) {
        } else {
          // this.router.navigate(['user/profile']);
        }
        this.store.select(getAuthStatus).subscribe(
          data => {
            if (data === true) { this.router.navigate([this.returnUrl]); }
          }
        );
      });
    } else {
      // keys.forEach(val => {
      //   const ctrl = this.signUpForm.controls[val];
      //   if (!ctrl.valid) {
      //     this.pushErrorFor(val, null);
      //     ctrl.markAsTouched();
      //   };
      // });
    }
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): {[key: string]: any} => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    };
  }

  ngOnDestroy() {
    if (this.registerSubs) { this.registerSubs.unsubscribe(); }
  }

}
export class User {
  
  password: 'test';
  verify: 'test';
  
}