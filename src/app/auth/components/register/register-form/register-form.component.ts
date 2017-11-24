import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  private pushErrorFor(ctrl_name: string, msg: string) {
    this.signUpForm.controls[ctrl_name].setErrors({'msg': msg});
  }

  ngOnInit() {
    this.initForm();
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

  ngOnDestroy() {
    if (this.registerSubs) { this.registerSubs.unsubscribe(); }
  }

}
