import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSellerAccountComponent } from './edit-seller-account.component';

describe('EditSellerAccountComponent', () => {
  let component: EditSellerAccountComponent;
  let fixture: ComponentFixture<EditSellerAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSellerAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSellerAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
