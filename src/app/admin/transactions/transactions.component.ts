import { Component, OnInit } from '@angular/core';
import { AdminService } from './../services/admin.service';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  transaction: any;
  transactionSub: Subscription;
  constructor(private adminService: AdminService) { }

  ngOnInit() {
    const sellerId = 0;
    this.transactionSub = this.adminService.getTransactions().subscribe(transaction => {
      this.transaction = transaction;
    });
  }

}
