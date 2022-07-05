import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentChart1Component } from './payment-chart1.component';

describe('PaymentChart1Component', () => {
  let component: PaymentChart1Component;
  let fixture: ComponentFixture<PaymentChart1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentChart1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentChart1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
