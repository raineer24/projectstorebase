import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerAccountInfoComponent } from './seller-account-info.component';

describe('SellerAccountInfoComponent', () => {
  let component: SellerAccountInfoComponent;
  let fixture: ComponentFixture<SellerAccountInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerAccountInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerAccountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
