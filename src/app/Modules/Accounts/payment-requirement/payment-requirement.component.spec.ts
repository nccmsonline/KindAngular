import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRequirementComponent } from './payment-requirement.component';

describe('PaymentRequirementComponent', () => {
  let component: PaymentRequirementComponent;
  let fixture: ComponentFixture<PaymentRequirementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentRequirementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
