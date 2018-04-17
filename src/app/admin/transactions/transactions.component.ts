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
  private activeTransaction: any;
  showDialog = false;
  @ViewChild('listDetailsModal') listDetailsModal;
  selectedRow: Number;
  setClickedRow(index) {
    this.selectedRow = index;
  }
  constructor(private adminService: AdminService) { 
    this.activeTransaction = null;
  }

  ngOnInit() {
    this.viewSub();

  }


  viewSub() {
    this.transactionSub = this.adminService.getTransactions().subscribe(transaction => {
      this.transaction = transaction;
    });
  }
  private selectTransaction(transactions: any) {
    if (this.activeTransaction = transactions) {
      this.listDetailsModal.open()
    }
  }
  private detailClosed() {
    this.activeTransaction = null;
  }
}