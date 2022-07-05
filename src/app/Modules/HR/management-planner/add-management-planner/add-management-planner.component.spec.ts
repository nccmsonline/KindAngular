import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManagementPlannerComponent } from './add-management-planner.component';

describe('AddManagementPlannerComponent', () => {
  let component: AddManagementPlannerComponent;
  let fixture: ComponentFixture<AddManagementPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddManagementPlannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddManagementPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
