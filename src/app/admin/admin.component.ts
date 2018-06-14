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
      type: 'main',
      rolesRequired: [2,6],
    },
    {
      name: "Users",
      routerLink: "/admin/users",
      type: 'main',
      rolesRequired: [1,6],
    },
    {
      name: "Transactions",
      routerLink: "/admin/transactions",
      type: 'main',
      rolesRequired: [3,6]
    },
    {
      name: "Logs",
      routerLink: "/admin/logs",
      type: 'main',
      rolesRequired: [1,5]
    },
    {
      name: "Admin Tools",
      type: 'label',
      rolesRequired: [5,6],
    },
    {
      name: "Manage Timeslot",
      routerLink: "/admin/tools/manage-timeslot",
      type: 'submenu',
      rolesRequired: [5,6],
    },
    {
      name: "Others",
      routerLink: "/admin/others",
      type: 'main',
      rolesRequired: [5,6],
    },
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
