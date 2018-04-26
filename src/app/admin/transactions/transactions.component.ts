import { Component, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { AdminService } from './../services/admin.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
declare let jsPDF;
import * as moment from 'moment';
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  
  selectedAll: any;
  public transaction: Transaction[] = [];
  //public transaction: Transaction[];
  transactionSub: Subscription;
  private activeTransaction: Transaction;
  public search: { order_id: string, dateCreated: number } = { order_id: '', dateCreated: null }

  public filtered: Transaction[];

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
    


     //var myJSON = JSON.stringify(this.transaction);
     //let x = myJSON["dateCreated"];
      // var myJSON = JSON.stringify(this.transaction);
      // let x = myJSON["dateCreated"];
      //localStorage.setItem('orderedList', JSON.stringify(this.transaction));
     // console.log(myJSON);
      console.log(this.transaction[0].dateCreated);
      console.log(this.transaction);
     
      //console.log(localStorage.getItem('orderedList'));
      
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
  getTransactionNames() {
    
  
    
    //var unique = myArray.filter((v, i, a) => a.indexOf(v) === i); 
    //return this.transaction 
      //.filter((v, i, a) => a.indexOf(v) === i), JSON.stringify(this.transaction); 
     // .filter((v) =>  JSON.stringify(v.dateCreated));
      //.filter((v) => moment(v.dateCreated).format("MMM Do YY"), JSON.stringify(this.transaction))
    //.map((v) => moment(v.dateCreated).format("MMM Do YY"), console.log(this.transaction));
    return this.transaction.map((v) => v.id)
  //.filter((v) => v.id)
    
  }
  // checkAll(ev) {
  //   this.transaction.forEach(x => x.checked = ev.target.checked)
  // }
  selectAll() {
    for (var i = 0; i < this.transaction.length; i++) {
      this.transaction[i].checked = this.selectedAll;
      console.log(this.selectedAll);
    }
  }
  download() {
    var item = this.transaction;
    console.log(item);
    var doc = new jsPDF();
    var col = ["Details", "Values"];
    var rows = [];

    for (var key in item) {
      //var temp = [key, item[key]];
      var temp = [key, JSON.stringify(item[key])];
      rows.push(temp);
      var string = doc.output('datauristring');

    }


    doc.autoTable(col, rows);
    console.log(col, rows);
    doc.save('invoice.pdf');
  }
  // public getCitiesAsObservable(token: string): Observable<any> {
  //   return Observable.of(
  //     this.transaction.filter((v: any) => {
  //       return Transaction.name.startsWith(token) || Transaction.country.startsWith(token);
  //     })
  //   );
  // }
  checkIfAllSelected() {
    this.selectedAll = this.transaction.every(function (item: any) {
      return item.checked == true

    });
    console.log(this.selectedAll);
  }
  getCheckedValues() {
    return this.transaction.filter(obj => obj.checked);
  }
}


export class Transaction {



  public id: number;
  public order_id: number;
  public dateCreated: number;
  public checked: false;



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
