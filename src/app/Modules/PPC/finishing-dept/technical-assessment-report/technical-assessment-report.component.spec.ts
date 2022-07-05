import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalAssessmentReportComponent } from './technical-assessment-report.component';

describe('TechnicalAssessmentReportComponent', () => {
  let component: TechnicalAssessmentReportComponent;
  let fixture: ComponentFixture<TechnicalAssessmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicalAssessmentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalAssessmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
