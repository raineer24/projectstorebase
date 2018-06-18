import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { getAuthStatus } from '../../../reducers/selectors';
import { Subscription } from 'rxjs/Subscription';
import { UserActions } from '../../../../user/actions/user.actions';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit, OnDestroy {
  signInForm: FormGroup;
  title = environment.AppName;
  loginSubs: Subscription;
  checkPartnerBuyer: Subscription;
  returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private userActions: UserActions,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    const values = this.signInForm.value;
    const data = {
      'username': values.email,
      'password': values.password
    };

    const keys = Object.keys(values);

    if (this.signInForm.valid) {
      this.loginSubs = this.authService.login(data).subscribe(data => {
        const error = data.error;
        if (error) {

        } else {
          const user = JSON.parse(localStorage.getItem('user'));
          this.checkPartnerBuyer = this.authService.checkPartnerBuyer(user.id).subscribe( isFound => {
            if (isFound)
            {
              localStorage.setItem('pbu','1');
              this.checkPartnerBuyer = this.authService.getPartnerBuyerUser(user.id).subscribe ( data => {
                localStorage.setItem('PBUser',JSON.stringify(data));
              })
            } else {
              localStorage.setItem('pbu','0');
            }

          });

          this.store.dispatch(this.userActions.getUserLists());
          this.router.navigate([this.returnUrl])
          //this.router.navigate(['user/profile']);
        }
      });
    } else {
      keys.forEach(val => {
        const ctrl = this.signInForm.controls[val];
        if (!ctrl.valid) {
          this.pushErrorFor(val, null);
          ctrl.markAsTouched();
        };
      });
    }
  }

  private pushErrorFor(ctrl_name: string, msg: string) {
    this.signInForm.controls[ctrl_name].setErrors({'msg': msg});
  }

  initForm() {
    const email = '';
    const password = '';

    this.signInForm = this.fb.group({
      'email': [email, Validators.required],
      'password': [password, Validators.required]
    });
  }

  redirectIfUserLoggedIn() {
    this.store.select(getAuthStatus).subscribe(
      data => {
        if (data === true) { this.router.navigate([this.returnUrl]); }
      }
    );
  }

  ngOnDestroy() {
    if (this.loginSubs) { this.loginSubs.unsubscribe(); }
  }
}
