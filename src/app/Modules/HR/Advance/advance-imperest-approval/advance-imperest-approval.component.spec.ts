import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceImperestApprovalComponent } from './advance-imperest-approval.component';

describe('AdvanceImperestApprovalComponent', () => {
  let component: AdvanceImperestApprovalComponent;
  let fixture: ComponentFixture<AdvanceImperestApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceImperestApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceImperestApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
