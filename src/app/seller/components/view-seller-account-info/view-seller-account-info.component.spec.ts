import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSellerAccountInfoComponent } from './view-seller-account-info.component';

describe('ViewSellerAccountInfoComponent', () => {
  let component: ViewSellerAccountInfoComponent;
  let fixture: ComponentFixture<ViewSellerAccountInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSellerAccountInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSellerAccountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
