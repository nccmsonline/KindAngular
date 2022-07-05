import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTechnicalAssessmentReportComponent } from './add-technical-assessment-report.component';

describe('AddTechnicalAssessmentReportComponent', () => {
  let component: AddTechnicalAssessmentReportComponent;
  let fixture: ComponentFixture<AddTechnicalAssessmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTechnicalAssessmentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTechnicalAssessmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
