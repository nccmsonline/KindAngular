import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewStoreRequisitionSlipComponent } from './add-new-store-requisition-slip.component';

describe('AddNewStoreRequisitionSlipComponent', () => {
  let component: AddNewStoreRequisitionSlipComponent;
  let fixture: ComponentFixture<AddNewStoreRequisitionSlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewStoreRequisitionSlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewStoreRequisitionSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
