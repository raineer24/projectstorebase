import { Component, OnInit, ViewChild, Pipe, PipeTransform, Renderer2 } from '@angular/core';
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
  selectedTransaction: Transaction[] = [];
  get isDisabled(): boolean {
    return this.selectedTransaction.length === 0;
  }
  //selectedAll: any;
  public transaction: Transaction[];
  //public transaction: Transaction[];
  transactionSub: Subscription;
  private activeTransaction: Transaction;
  public search: { order_id: string, dateCreated: number } = { order_id: '', dateCreated: null }

  public filtered: Transaction[];

  @ViewChild('actionsButton') actionsButton;

  @ViewChild('listDetailsModal') listDetailsModal;
  selectedRow: Number;

  setClickedRow(index) {
    this.selectedRow = index;
  }
  constructor(private adminService: AdminService, private renderer: Renderer2) {
    this.activeTransaction = null;
    setTimeout(() => { this.renderer.setAttribute(this.actionsButton.nativeElement, 'disabled', this.isDisabled ? 'disabled' : null); }, 1000);
  }

  ngOnInit() {
    this.viewSub();
    this.filtered = this.transaction;

  }
  // changeState() {
  //   this.isDisabled = !this.isDisabled;
  //   console.log("clciked");
  // }

  format(dateCreated) {
    console.log(dateCreated);
   // return dateCreated = new Date();
    //return dateCreated = moment().format("MMM Do YY");
    return moment(dateCreated).format("MMM Do YY");
    
  }
  onRowSelect(event) {
    this.selectedTransaction;
    console.log(this.selectedTransaction);
  }
  private buildPdf() {
    var item = this.selectedTransaction;
    if (item != this.selectedTransaction) {
      console.log("error!");
    } else {
      var doc = new jsPDF();
      var col = ["Order Id", "Transaction Number", "Status", "Date Created"];
      var rows = [];
      item.forEach(element => {
        var temp = [element.order_id, element.dateCreated, element.action, element.dateCreated];
        rows.push(temp);
      });
      doc.autoTable(col, rows);

      console.log(col, rows);

    }
    return doc;

  }
  public download() {
    const pdf = this.buildPdf();
    // download pdf
    pdf.save('invoice.pdf');
  }
  public print() {
    const pdf = this.buildPdf();
    // print pdf
    pdf.addJS('print({});');
    window.open(pdf.output('bloburl'), '_blank');
  }
  viewSub() {
    this.adminService.getTransactions()
    .map((data: Transaction[]) => {
      return data.map((transaction: Transaction) => {
        transaction.dateCreated = moment(transaction.dateCreated).format("MMM Do YYYY");
        return transaction;
      })
    })
    .subscribe((data: Transaction[])=> {
      this.transaction = data;






      //var myJSON = JSON.stringify(this.transaction);
      //let x = myJSON["dateCreated"];
      // var myJSON = JSON.stringify(this.transaction);
      // let x = myJSON["dateCreated"];
      //localStorage.setItem('orderedList', JSON.stringify(this.transaction));
      // console.log(myJSON);
      //console.log(moment(this.transaction[0].dateCreated).format("MMM Do YY"));
      console.log(this.transaction);

      //console.log(localStorage.getItem('orderedList'));

    });


  }
  private selectTransaction(transaction: Transaction) {
    this.activeTransaction = transaction
    this.listDetailsModal.open()

  }
  selectOrder(data) {
    this.activeTransaction = data;
    this.listDetailsModal.open();
  }
  private detailClosed() {
    this.activeTransaction = null;
  }
  closeItemDialog() {
    this.listDetailsModal.close()
  }
  getTransactionNames() {



    //var unique = myArray.filter((v, i, a) => a.indexOf(v) === i); 
    //return this.transaction.filter((v) =>  JSON.stringify(v.dateCreated));
    //.filter((v, i, a) => a.indexOf(v) === i), JSON.stringify(this.transaction); 
    // .filter((v) =>  JSON.stringify(v.dateCreated));
    //.filter((v) => moment(v.dateCreated).format("MMM Do YY"), JSON.stringify(this.transaction))
    //.map((v) => moment(v.dateCreated).format("MMM Do YY"), console.log(this.transaction));
    // return this.transaction.map((v) => v.id)
    //.filter((v) => v.id)
    // this.filtered = this.transaction.filter((t) => {
    //   let state = true;
    //   if (this.search.order_id && t.order_id
    //     .toLowerCase().indexOf(this.search.order_id.toLowerCase()) === -1) {
    //     state = state && false;
    //   }
    //   if (this.search.dateCreated && t.dateCreated) {
    //     /* code */
    //   }
    //   return state;

    // });
  }
  // checkAll(ev) {
  //   this.transaction.forEach(x => x.checked = ev.target.checked)
  // }
  // selectAll() {
  //   for (var i = 0; i < this.transaction.length; i++) {
  //     this.transaction[i].checked = this.selectedAll;
  //     console.log(this.selectedAll);
  //   }
  // }
 
  // public getCitiesAsObservable(token: string): Observable<any> {
  //   return Observable.of(
  //     this.transaction.filter((v: any) => {
  //       return Transaction.name.startsWith(token) || Transaction.country.startsWith(token);
  //     })
  //   );
  // }
  // checkIfAllSelected() {
  //   this.selectedAll = this.transaction.every(function (item: any) {
  //     return item.checked == true

  //   });
  //   console.log(this.selectedAll);
  // }
  getCheckedValues() {
    return this.transaction.filter(obj => obj.checked);
  }
}


export class Transaction {



  public id: number;
  public order_id: string;
  public dateCreated: number | string;
  public checked: false;
  public action: string;



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