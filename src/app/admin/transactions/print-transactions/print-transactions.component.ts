import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
declare let jsPDF;
@Component({
  selector: 'app-print-transactions',
  templateUrl: './print-transactions.component.html',
  styleUrls: ['./print-transactions.component.scss']

})

export class PrintTransactionsComponent implements OnInit {
  @Input() display: boolean;
  @Input() transaction: any;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }
  close(){
    this.display = false;
    this.visibleChange.emit(this.display);
    console.log(this.display);
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
}
