import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalAssessmentComponent } from './technical-assessment.component';

describe('TechnicalAssessmentComponent', () => {
  let component: TechnicalAssessmentComponent;
  let fixture: ComponentFixture<TechnicalAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicalAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
