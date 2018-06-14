import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from './services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  userData: any;
  menuItems = [
    {
      name: "Orders",
      routerLink: "/admin/orders",
      rolesRequired: [2,5]
    },
    {
      name: "Users",
      routerLink: "/admin/users",
      rolesRequired: [1,5]
    },
    {
      name: "Partnerbuyer",
      routerLink: "/admin/pbu",
      rolesRequired: [1,7]
    },
    {
      name: "Transactions",
      routerLink: "/admin/transactions",
      rolesRequired: [3,5]
    }
  ]
  constructor(
    private adminService: AdminService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('selleruser'));
    document.body.classList.add('admin-body');
  }

  logout(): void {
    this.adminService.logout();
  }

  getMenu(){
    const userRole = this.adminService.getUserRole();
    return this.menuItems.filter(
      menuItem => menuItem.rolesRequired.includes(userRole)
    )
  }
}
