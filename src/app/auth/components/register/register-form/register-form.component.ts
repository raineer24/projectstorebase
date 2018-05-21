import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../../../../interfaces';
import { getAuthStatus } from '../../../reducers/selectors';
import { AuthService } from '../../../../core/services/auth.service';
import * as moment from 'moment';


@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit, OnDestroy {
  signUpForm: FormGroup;
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
    this.signUpForm.controls[ctrl_name].setErrors({ 'msg': msg });
  }

  ngOnInit() {
    this.initForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  initForm() {
    this.signUpForm = this.fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.email])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      'password_confirmation': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      'mobile': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]{10}')])],
      'gender': ['', Validators.required],
      'prefix': ['+63', Validators.required],
      'month': ['', Validators.required],
      'day': ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{1,2}')])],
      'year': ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{4}')])],
    }, {
      validator: Validators.compose([this.matchingPasswords('password', 'password_confirmation'), this.isValidDate()])
    });
  }

  onSubmit() {
    const values = this.signUpForm.value;

    if (this.signUpForm.valid) {
      const data = {
        'username': values.email,
        'email': values.email,
        'password': values.password,
        'uiid': '',
        'mobileNumber': values.prefix + " " + values.mobile,
        'gender': values.gender,
        'lastName': values.last_name || '',
        'firstName': values.first_name || '',
        'birthdate': new Date(`${values.year}-${values.month}-${values.day}`).getTime(),
      };

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
      const keys = Object.keys(values);
      keys.forEach(val => {
        const ctrl = this.signUpForm.controls[val];
        if (!ctrl.valid) {
          this.pushErrorFor(val, null);
          ctrl.markAsTouched();
        };
      });
    }
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    };
  }

  isValidDate() {
    return (group: FormGroup): {[key: string]: any } => {
      const day = moment(`${group.controls['year'].value}-${group.controls['month'].value}-${group.controls['day'].value}`);
      if (!day.isValid() || day > moment()) {
        return {
          invalidDate: true
        };
      }
    };
  }

  ngOnDestroy() {
    if (this.registerSubs) { this.registerSubs.unsubscribe(); }
  }

}
