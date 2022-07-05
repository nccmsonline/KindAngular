import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverTimeAmendmentApprovalComponent } from './over-time-amendment-approval.component';

describe('OverTimeAmendmentApprovalComponent', () => {
  let component: OverTimeAmendmentApprovalComponent;
  let fixture: ComponentFixture<OverTimeAmendmentApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverTimeAmendmentApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverTimeAmendmentApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
