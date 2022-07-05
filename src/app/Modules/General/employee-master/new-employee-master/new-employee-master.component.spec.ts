import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEmployeeMasterComponent } from './new-employee-master.component';

describe('NewEmployeeMasterComponent', () => {
  let component: NewEmployeeMasterComponent;
  let fixture: ComponentFixture<NewEmployeeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEmployeeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEmployeeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
