import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementPlannerComponent } from './management-planner.component';

describe('ManagementPlannerComponent', () => {
  let component: ManagementPlannerComponent;
  let fixture: ComponentFixture<ManagementPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementPlannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
