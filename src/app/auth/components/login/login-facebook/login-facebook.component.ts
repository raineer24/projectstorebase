import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { getAuthStatus } from '../../../reducers/selectors';
import { Subscription } from 'rxjs/Subscription';

declare const window: any;
declare const FB: any;

@Component({
  selector: 'app-login-facebook',
  templateUrl: './login-facebook.component.html',
  styleUrls: ['./login-facebook.component.scss']
})
export class LoginFacebookComponent implements OnInit, OnDestroy {
  loginSubs: Subscription;
  returnUrl: string;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    (function(d, s, id){
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return; }
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    window.fbAsyncInit = () => {
      console.log('fbasyncinit');
      FB.init({
        appId            : '1858414594186264',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v2.10'
      });
      FB.AppEvents.logPageView();
    // This is where we do most of our code dealing with the FB variable like adding an observer to check when the user signs in
      FB.Event.subscribe('auth.statusChange', (response => {
        console.log(response.status);
        if (response.status === 'connected') {
            // use the response variable to get any information about the user and to see the tokens about the users session
            this.onLoginSuccess();
        }
      }));
    };

  }

  ngOnInit() {
    if (window.FB) {
        window.FB.XFBML.parse();
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnDestroy() {
    if (this.loginSubs) { this.loginSubs.unsubscribe(); }
  }

  onLoginSuccess() {
    FB.api('/me', {fields: 'id,name,email'}, response => {
      console.log(`Successful login for: ${response.name} | Email: ${response.email}`);
      const body = {
        // 'username': 'fallenaskari_21@yahoo.com',
        // 'password': 'password'
        'username': response.email,
        'password': response.email,
        'uiid': response.id
      };
      this.loginSubs = this.authService.loginFB(body).subscribe(data => {
        const error = data.error;
        if (error) {

        } else {
          this.router.navigate(['user/profile']);
        }
        //this.store.select(getAuthStatus).subscribe(
        //  data => {
        //    if (data === true) { this.router.navigate([this.returnUrl]); }
        //  }
        //);
      });
    });


  }

}