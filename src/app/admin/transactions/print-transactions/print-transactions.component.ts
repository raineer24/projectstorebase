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
     
    var doc = new jsPDF();
    var col = ["Details", "Values"];
    var rows = [];

    for (var key in item) {
      var temp = [key, item[key]];
      rows.push(temp);
    }

    doc.autoTable(col, rows);

    doc.save('Test.pdf');
  }
}
