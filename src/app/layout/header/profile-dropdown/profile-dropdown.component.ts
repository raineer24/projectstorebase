import { Component, OnInit, Input } from '@angular/core';
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

}
