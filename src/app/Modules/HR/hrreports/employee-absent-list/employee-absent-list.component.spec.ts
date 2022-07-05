import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAbsentListComponent } from './employee-absent-list.component';

describe('EmployeeAbsentListComponent', () => {
  let component: EmployeeAbsentListComponent;
  let fixture: ComponentFixture<EmployeeAbsentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeAbsentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAbsentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
