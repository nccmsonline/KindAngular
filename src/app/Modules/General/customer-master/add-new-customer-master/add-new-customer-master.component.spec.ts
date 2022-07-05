import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCustomerMasterComponent } from './add-new-customer-master.component';

describe('AddNewCustomerMasterComponent', () => {
  let component: AddNewCustomerMasterComponent;
  let fixture: ComponentFixture<AddNewCustomerMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewCustomerMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewCustomerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
