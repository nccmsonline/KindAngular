import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeGatePassListReportComponent } from './employee-gate-pass-list-report.component';

describe('EmployeeGatePassListReportComponent', () => {
  let component: EmployeeGatePassListReportComponent;
  let fixture: ComponentFixture<EmployeeGatePassListReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeGatePassListReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeGatePassListReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
