import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSellerAccountComponent } from './view-seller-account.component';

describe('ViewSellerAccountComponent', () => {
  let component: ViewSellerAccountComponent;
  let fixture: ComponentFixture<ViewSellerAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSellerAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSellerAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
