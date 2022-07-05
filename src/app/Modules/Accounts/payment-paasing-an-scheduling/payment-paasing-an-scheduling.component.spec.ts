import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPaasingAnSchedulingComponent } from './payment-paasing-an-scheduling.component';

describe('PaymentPaasingAnSchedulingComponent', () => {
  let component: PaymentPaasingAnSchedulingComponent;
  let fixture: ComponentFixture<PaymentPaasingAnSchedulingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentPaasingAnSchedulingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPaasingAnSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
