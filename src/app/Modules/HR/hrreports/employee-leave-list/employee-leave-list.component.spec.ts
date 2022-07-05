import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveListComponent } from './employee-leave-list.component';

describe('EmployeeLeaveListComponent', () => {
  let component: EmployeeLeaveListComponent;
  let fixture: ComponentFixture<EmployeeLeaveListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeLeaveListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeLeaveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
