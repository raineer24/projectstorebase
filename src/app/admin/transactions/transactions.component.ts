import { Component, OnInit, ViewChild } from '@angular/core';
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
  showDialog = false;
  @ViewChild('UserDetailsModal') UserDetailsModal;
  selectedRow: Number;
  setClickedRow(index) {
    this.selectedRow = index;
  }
  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.viewSub();

  }
  openItemDialog() {
    this.UserDetailsModal.open();
  }


  viewSub() {
    this.transactionSub = this.adminService.getTransactions().subscribe(transaction => {
      this.transaction = transaction;
    });
  }
}