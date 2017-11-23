import { Component, OnInit, OnDestroy} from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../interfaces';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { getAuthStatus } from '../../../reducers/selectors';

declare const window: any;
declare const FB: any;

@Component({
  selector: 'app-register-facebook',
  templateUrl: './register-facebook.component.html',
  styleUrls: ['./register-facebook.component.scss']
})
export class RegisterFacebookComponent implements OnInit, OnDestroy {
  title = environment.AppName;

  constructor(
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
      FB.Event.subscribe('auth.statusChange', (response => {
        console.log(response.status)
        if (response.status === 'connected') {
            // use the response variable to get any information about the user and to see the tokens about the users session
            FB.api('/me', function(res) {
              console.log('Successful login for: ' + res.name + ' '+ res.email);
            });
        }
      }));
    };
  }

  ngOnInit() {
    if (window.FB) {
        window.FB.XFBML.parse();
    }
  }


  redirectIfUserLoggedIn() {
    this.store.select(getAuthStatus).subscribe(
      data => {
        if (data === true) { this.router.navigateByUrl('/'); }
      }
    );
  }

  ngOnDestroy() { }



}
