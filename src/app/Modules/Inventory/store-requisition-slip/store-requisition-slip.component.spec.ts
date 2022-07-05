import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreRequisitionSlipComponent } from './store-requisition-slip.component';

describe('StoreRequisitionSlipComponent', () => {
  let component: StoreRequisitionSlipComponent;
  let fixture: ComponentFixture<StoreRequisitionSlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreRequisitionSlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreRequisitionSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
