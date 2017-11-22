import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../../interfaces';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { getAuthStatus } from '../../reducers/selectors';
import { Subscription } from 'rxjs/Subscription';

declare var window: any;
declare var FB: any;

@Component({
   selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  signUpForm: FormGroup;
  formSubmit = false;
  title = environment.AppName;
  registerSubs: Subscription;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private authService: AuthService
  ) {
    this.redirectIfUserLoggedIn();
    // This function initializes the FB variable
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    window.fbAsyncInit = () => {
      console.log("fbasyncinit")
      FB.init({
        appId            : '382515518454780',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v2.10'
      });
      FB.AppEvents.logPageView();
    // This is where we do most of our code dealing with the FB variable like adding an observer to check when the user signs in
    };
  }

  ngOnInit() {
    this.initForm();
  }

  onSubmit() {
    const values = this.signUpForm.value;
    const keys = Object.keys(values);
    this.formSubmit = true;

    if (this.signUpForm.valid) {
      this.registerSubs = this.authService.register(values).subscribe(data => {
        const errors = data.errors;
        if (errors) {
          keys.forEach(val => {
            if (errors[val]) { this.pushErrorFor(val, errors[val][0]); };
          });
        }
      });
    } else {
      keys.forEach(val => {
        const ctrl = this.signUpForm.controls[val];
        if (!ctrl.valid) {
          this.pushErrorFor(val, null);
          ctrl.markAsTouched();
        };
      });
    }
  }

  private pushErrorFor(ctrl_name: string, msg: string) {
    this.signUpForm.controls[ctrl_name].setErrors({'msg': msg});
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
      'mobile': [mobile, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10),Validators.pattern('[0-9]{10}')]) ],
      'gender': [gender, Validators.required]
    },{validator: this.matchingPasswords('password', 'password_confirmation')}
	);
  }

  redirectIfUserLoggedIn() {
    this.store.select(getAuthStatus).subscribe(
      data => {
        if (data === true) { this.router.navigateByUrl('/'); }
      }
    );
  }

  ngOnDestroy() {
    if (this.registerSubs) { this.registerSubs.unsubscribe(); }
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
  return (group: FormGroup): {[key: string]: any} => {
    let password = group.controls[passwordKey];
    let confirmPassword = group.controls[confirmPasswordKey];

    if (password.value !== confirmPassword.value) {
      return {
        mismatchedPasswords: true
      };
    }
  }
}




}
