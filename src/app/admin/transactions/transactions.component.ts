import { Component, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { AdminService } from './../services/admin.service';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  transaction: Transaction[];
  transactionSub: Subscription;
  private activeTransaction: Transaction;
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
   this.adminService.getTransactions().subscribe(transaction => {
      this.transaction = transaction;
      console.log(this.transaction);
    });
  }
  private selectTransaction(transaction: Transaction) {
    this.activeTransaction = transaction
    this.listDetailsModal.open()
   
  }
  private detailClosed() {
    this.activeTransaction = null;
  }
  closeItemDialog() {
    this.listDetailsModal.close()
  }
}


export class Transaction {
  
  name: string;
 transactionId: number;
  id: number;

  


}
@Pipe({
  name: 'sorthwithId'
})
export class SortPipe implements PipeTransform {
  transform(array: any[], field: string): any[] {
    if (array !== undefined) {
    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });
    }
    return array;
  }
}