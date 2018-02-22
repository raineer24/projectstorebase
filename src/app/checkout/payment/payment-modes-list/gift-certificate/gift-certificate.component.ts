import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-gift-certificate-dialog',
  templateUrl: './gift-certificate.component.html',
  styleUrls: ['./gift-certificate.component.scss']
})
export class GiftCertificateComponent implements OnInit, OnDestroy{

  @Output() giftCert: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  onPay() {
    this.giftCert.emit(true);
  }

  ngOnDestroy() {
  }


}
