import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-static-pages',
  templateUrl: './static-pages.component.html',
  styleUrls: ['./static-pages.component.scss']
})
export class StaticPagesComponent implements OnInit {
  currentPage: string;

  constructor(
    private router: Router,
  ) {
    router.events.filter(e => e instanceof NavigationEnd).subscribe((e: NavigationEnd) => {
      const currRouteFragments = e.url.split('/');
      this.currentPage = currRouteFragments[currRouteFragments.length - 1];
    });
  }

  ngOnInit() {
  }

}
