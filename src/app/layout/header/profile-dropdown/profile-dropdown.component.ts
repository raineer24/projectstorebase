import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs'
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.scss']
})
export class ProfileDropdownComponent implements OnInit {
  mobile: boolean;
  @Input() isAuthenticated: boolean;
  @Input() totalCartItems: number;
  @Input() totalCartValue: number;
  @ViewChild('cartDropdown') cartDropdown;
  isShowCartPreview: boolean = false;
  cartPreviewSub: Subscription;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {

  }

  logout() {
    this.authService.logout().subscribe(
      data => console.log(data)
    );
    window.location.href="./index.html";
  }

  showCartPreview(): void {
    this.cartPreviewSub = Observable.fromEvent(document, 'click').subscribe((e: any) => {
      if (!this.cartDropdown._elementRef.nativeElement.contains(e.target)) {
        this.cartDropdown.hide();
      }
    });
  }

  hideCartPreview(): void {
    this.cartPreviewSub.unsubscribe();
  }
}
