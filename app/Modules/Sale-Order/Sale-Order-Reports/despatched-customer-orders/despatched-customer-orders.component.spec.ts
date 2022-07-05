import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DespatchedCustomerOrdersComponent } from './despatched-customer-orders.component';

describe('DespatchedCustomerOrdersComponent', () => {
  let component: DespatchedCustomerOrdersComponent;
  let fixture: ComponentFixture<DespatchedCustomerOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DespatchedCustomerOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DespatchedCustomerOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
