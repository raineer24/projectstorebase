import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Transaction } from './../transactions.component';
//import * as jsPDF from 'jspdf'

//import 'jspdf-autotable';
declare var jsPDF: any; 
@Component({
  selector: 'app-print-transactions',
  templateUrl: './print-transactions.component.html',
  styleUrls: ['./print-transactions.component.scss']

})

export class PrintTransactionsComponent implements OnInit {
  @Input() trans: Transaction;
 
  
  

  @Output() onCloseModalEmit: EventEmitter<string> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
 
 
  private buildPdf() {
    var item = this.trans;
    console.log(item);
    if (item) {
      var doc = new jsPDF();
      var col = ["Order Id", "Transaction Number", "Status", "Date Created"];
      var rows = [];
      rows.push([item.order_id, item.id, item.action, item.dateCreated]);
      doc.autoTable(col, rows);
      console.log(col, rows);
    } else {
      console.log("error");
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

  // private buildPdf() {
  //   var item = this.trans;
  //   console.log(item);
  //   if (item) {
  //     var doc: jsPDF = new jsPDF();
  //     var col = ["Order Id", "Transaction Number", "Status", "Date Created"];
  //     var rows = [[]];
  //     rows.push([item.order_id, "123", "NEW", item.dateCreated]);
  //     doc.autoTable(col, rows);
  //     console.log(col, rows);
  //   } else {
  //     console.log("error");
  //   }
  //   return doc;

  // }
  onCloseModal() {
    this.onCloseModalEmit.emit();
  }
}
