import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSellerAccountDetailsComponent } from './edit-seller-account-details.component';

describe('EditSellerAccountDetailsComponent', () => {
  let component: EditSellerAccountDetailsComponent;
  let fixture: ComponentFixture<EditSellerAccountDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSellerAccountDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSellerAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
