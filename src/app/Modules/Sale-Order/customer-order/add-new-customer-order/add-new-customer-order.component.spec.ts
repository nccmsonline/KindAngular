import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCustomerOrderComponent } from './add-new-customer-order.component';

describe('AddNewCustomerOrderComponent', () => {
  let component: AddNewCustomerOrderComponent;
  let fixture: ComponentFixture<AddNewCustomerOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewCustomerOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewCustomerOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
