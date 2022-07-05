import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChnageModeOfPaymentComponent } from './chnage-mode-of-payment.component';

describe('ChnageModeOfPaymentComponent', () => {
  let component: ChnageModeOfPaymentComponent;
  let fixture: ComponentFixture<ChnageModeOfPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChnageModeOfPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChnageModeOfPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
