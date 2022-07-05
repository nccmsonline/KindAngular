import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecieveCustomerOrderComponent } from './recieve-customer-order.component';

describe('RecieveCustomerOrderComponent', () => {
  let component: RecieveCustomerOrderComponent;
  let fixture: ComponentFixture<RecieveCustomerOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecieveCustomerOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecieveCustomerOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
