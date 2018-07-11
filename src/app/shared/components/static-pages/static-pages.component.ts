import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from "rxjs";
import { Observable } from "rxjs/Rx";
import { AppState } from './../../../interfaces';
import { getAuthStatus } from './../../../auth/reducers/selectors';
declare var $zopim : any;

@Component({
  selector: 'app-static-pages',
  templateUrl: './static-pages.component.html',
  styleUrls: ['./static-pages.component.scss']
})
export class StaticPagesComponent implements OnInit {
  currentPage: string;
  isAuthenticated: Observable<boolean>;

  constructor(
    private router: Router,
    private store: Store<AppState>,
  ) {
    console.log(router);
    this.currentPage = router.url;
    // router.events.filter(e => e instanceof NavigationEnd).subscribe((e: NavigationEnd) => {
    //   const currRouteFragments = e.url.split('/');
    //   this.currentPage = currRouteFragments[currRouteFragments.length - 1];
    // });
  }

  ngOnInit() {
    this.isAuthenticated = this.store.select(getAuthStatus);
  }

  ngOnDestroy() {
    $zopim.livechat.hideAll();
  }

  showChat() {
    const user = JSON.parse(localStorage.getItem('user'));
    $zopim.livechat.set({
      name: user.firstName +' '+ user.lastName,
      email: user.email,
    });
    $zopim.livechat.window.show();
  }

}
