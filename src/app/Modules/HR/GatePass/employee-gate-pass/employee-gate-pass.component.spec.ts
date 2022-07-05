import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeGatePassComponent } from './employee-gate-pass.component';

describe('EmployeeGatePassComponent', () => {
  let component: EmployeeGatePassComponent;
  let fixture: ComponentFixture<EmployeeGatePassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeGatePassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeGatePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
