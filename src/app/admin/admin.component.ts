import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from './services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

/*
(1,'EOS Dev'
(2,'EOS Admin'
(3,'PS Admin'
(4,'PS Assembly'0
5,'PS Finance'
(6,'PS Management'
(7,'PB Admin'
(8,'PB Finance'
(9,'Partner Seller - Shopper'
(10,'Partner Seller - Delivery'

*/
  userData: any;
  isCollapsed: boolean = true;
  menuItems = [
    {
      name: "Assemble Order",
      routerLink: "/admin/order-assemble",
      type: 'main',
      rolesRequired: [1,4,9,10],
    },
    {
      name: "Orders",
      routerLink: "/admin/orders",
      type: 'main',
      rolesRequired: [1,2,3],
    },
    {
      name: "Users",
      routerLink: "/admin/users",
      type: 'main',
      rolesRequired: [1,2,3,7],
    },
    {
      name: "Partnerbuyer",
      routerLink: "/admin/pbu",
      rolesRequired: [1,7]
    },
    {
      name: "Transactions",
      routerLink: "/admin/transactions",
      type: 'main',
      rolesRequired: [1,5,8]
    },
    {
      name: "Logs",
      routerLink: "/admin/logs",
      type: 'main',
      rolesRequired: [1,2,3]
    },
    {
      name: "Admin Tools",
      type: 'label',
      rolesRequired: [1,2],
    },
    {
      name: "Manage Timeslot",
      routerLink: "/admin/tools/manage-timeslot",
      type: 'submenu',
      rolesRequired: [1,2],
    },
    {
      name: "Master List",
      type: 'label',
      rolesRequired: [1,2,3],
    },
    {
      name: "Manage Item List",
      routerLink:"/admin/master-list/components/add-items",
      type: 'submenu',
      rolesRequired: [1,2,3],
    },
    // {
    //   name: "Manage Categories",
    //   routerLink:"/admin/master-list/components/add-category",
    //   type: 'submenu',
    //   rolesRequired: [1,2,3],
    // },
    {
      name: "Item List",
      routerLink:"/admin/master-list/components/item-list",
      type: 'submenu',
      rolesRequired: [1,2,3],
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
    this.router.navigate(['/admin/login']);
  }

  getMenu(){
    const userRole = this.adminService.getUserRole();
    return this.menuItems.filter(
      menuItem => menuItem.rolesRequired.includes(userRole)
    )
  }
}
