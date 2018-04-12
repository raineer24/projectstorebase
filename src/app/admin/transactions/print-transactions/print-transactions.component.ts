import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-print-transactions',
  templateUrl: './print-transactions.component.html',
  styleUrls: ['./print-transactions.component.scss'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})

export class PrintTransactionsComponent implements OnInit {
  @Input() display: boolean;
  @Input() transaction: any;
  constructor() { }

  ngOnInit() {
  }
  close(){
    this.display = false;
  
  }
}
