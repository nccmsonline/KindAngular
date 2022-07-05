import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatePassApprovalComponent } from './gate-pass-approval.component';

describe('GatePassApprovalComponent', () => {
  let component: GatePassApprovalComponent;
  let fixture: ComponentFixture<GatePassApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatePassApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatePassApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
