import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintTransactionsComponent } from './print-transactions.component';

describe('PrintTransactionsComponent', () => {
  let component: PrintTransactionsComponent;
  let fixture: ComponentFixture<PrintTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
