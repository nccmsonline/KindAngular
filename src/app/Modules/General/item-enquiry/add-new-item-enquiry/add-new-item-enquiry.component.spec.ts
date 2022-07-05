import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewItemEnquiryComponent } from './add-new-item-enquiry.component';

describe('AddNewItemEnquiryComponent', () => {
  let component: AddNewItemEnquiryComponent;
  let fixture: ComponentFixture<AddNewItemEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewItemEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewItemEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
