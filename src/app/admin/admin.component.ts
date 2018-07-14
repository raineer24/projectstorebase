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
1,'EOS Dev'
2,'EOS Admin'
3,'Partner Seller - Admin'
4,'Partner Seller - Coordinator'
5,'Partner Seller - Finance'
6,'Partner Seller - Management'
7,'Partner Buyer - Admin'
8,'Partner Buyer - Finance'
9,'Partner Seller - Assembly'
10,'Partner Seller - Delivery'
11, 'EOS Customer Support 1'
12, 'EOS Customer Support 2'
13, 'EOS Finance'

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
      rolesRequired: [1,2,4,5,6,8,11,12,13],
    },
    {
      name: "Users",
      routerLink: "/admin/users",
      type: 'main',
      rolesRequired: [1,2,3,7],
    },
    {
      name: "Employees",
      routerLink: "/admin/pbu",
      rolesRequired: [1,8]
    },
    // {
    //   name: "Transactions",
    //   routerLink: "/admin/transactions",
    //   type: 'main',
    //   rolesRequired: [1,5,8]
    // },
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
    {
      name: "Update Items",
      routerLink:"/admin/master-list/components/update-items",
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
