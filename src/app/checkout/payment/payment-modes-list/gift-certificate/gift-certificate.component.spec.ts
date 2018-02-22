import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftCertificateComponent } from './gift-certificate.component';

describe('GiftCertificateComponent', () => {
  let component: GiftCertificateComponent;
  let fixture: ComponentFixture<GiftCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
