import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Transaction } from './../transactions.component';
declare let jsPDF;
@Component({
  selector: 'app-print-transactions',
  templateUrl: './print-transactions.component.html',
  styleUrls: ['./print-transactions.component.scss']

})

export class PrintTransactionsComponent implements OnInit {
  @Input() trans: Transaction[];
 
  //@Input() transaction: any;
  
  @Output() onClosed: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }
 
  download() {
    var item = this.trans;
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
  private onClose() {
    this.onClosed.emit(true);
  }
}
