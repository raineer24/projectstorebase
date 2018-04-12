import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-print-transactions',
  templateUrl: './print-transactions.component.html',
  styleUrls: ['./print-transactions.component.scss']
})
export class PrintTransactionsComponent implements OnInit {
  @Input() display: boolean;
  constructor() { }

  ngOnInit() {
  }

}
