import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AdminService } from './../../../services/admin.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string;
  loginSubs: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {
    this.redirectIfUserLoggedIn();
  }

  ngOnInit() {
    document.body.classList.add('admin-body');
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
    this.loginForm = this.fb.group({
      'password': ['', Validators.required],
      'verify': ['', Validators.required]
    });
  }

  ngOnDestroy() {
    if (this.loginSubs) {
      this.loginSubs.unsubscribe();
    }
  }

  onSubmit(): void {
    const values = this.loginForm.value;
    const data = {
      'username': values.username,
      'password': values.password
    };

    if (this.loginForm.valid) {

    } else {
      const keys = Object.keys(values);
      keys.forEach(val => {
        const ctrl = this.loginForm.controls[val];
        if (!ctrl.valid) {
          this.pushErrorFor(val, null);
          ctrl.markAsTouched();
        };
      });
    }
  }

  private pushErrorFor(ctrl_name: string, msg: string): void {
    this.loginForm.controls[ctrl_name].setErrors({'msg': msg});
  }

  redirectIfUserLoggedIn(): void {
    // this.store.select(getAuthStatus).subscribe(
    //   data => {
    //     if (data === true) { this.router.navigate([this.returnUrl]); }
    //   }
    // );
  }

}
