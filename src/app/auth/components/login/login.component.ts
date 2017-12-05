import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../../interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { getAuthStatus } from '../../reducers/selectors';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit  {
  title = environment.AppName;
  returnUrl: string;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.redirectIfUserLoggedIn();
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  redirectIfUserLoggedIn() {
    this.store.select(getAuthStatus).subscribe(
      data => {
        if (data === true) { this.router.navigate([this.returnUrl]); }
      }
    );
  }

}
