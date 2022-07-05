import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingCustomerOrdersComponent } from './pending-customer-orders.component';

describe('PendingCustomerOrdersComponent', () => {
  let component: PendingCustomerOrdersComponent;
  let fixture: ComponentFixture<PendingCustomerOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingCustomerOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingCustomerOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
