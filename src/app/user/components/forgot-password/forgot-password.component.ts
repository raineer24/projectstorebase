import { Component, OnInit, Directive, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NG_VALIDATORS, Validator } from '@angular/forms';
import { INVALID } from '@angular/forms/src/model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, Validators.email]) ]
    });
  }

  onSubmit(){
    if(this.forgotPasswordForm.valid) {
      this.authService.requestPasswordReset(this.forgotPasswordForm.controls['email'].value).subscribe();
    } else {
      const ctrl = this.forgotPasswordForm.controls['email'];
      if(!ctrl.valid){
        ctrl.markAsTouched();
      }
    }
  }

}
