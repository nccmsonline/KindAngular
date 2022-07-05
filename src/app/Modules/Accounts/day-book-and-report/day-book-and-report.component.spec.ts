import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayBookAndReportComponent } from './day-book-and-report.component';

describe('DayBookAndReportComponent', () => {
  let component: DayBookAndReportComponent;
  let fixture: ComponentFixture<DayBookAndReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayBookAndReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayBookAndReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
