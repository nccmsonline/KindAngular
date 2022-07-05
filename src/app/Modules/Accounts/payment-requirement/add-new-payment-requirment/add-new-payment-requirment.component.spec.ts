import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPaymentRequirmentComponent } from './add-new-payment-requirment.component';

describe('AddNewPaymentRequirmentComponent', () => {
  let component: AddNewPaymentRequirmentComponent;
  let fixture: ComponentFixture<AddNewPaymentRequirmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewPaymentRequirmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewPaymentRequirmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
