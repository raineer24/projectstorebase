import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../../environments/environment';

declare const window: any;
declare const FB: any;

@Component({
  selector: 'app-login-facebook',
  templateUrl: './login-facebook.component.html',
  styleUrls: ['./login-facebook.component.scss']
})
export class LoginFacebookComponent implements OnInit {

  constructor() {
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
        appId            : '1858414594186264',
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
            FB.api('/me', {fields: 'id,name,first_name,last_name,email'}, function(res) {
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

}
