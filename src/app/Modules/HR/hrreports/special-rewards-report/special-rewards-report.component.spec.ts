import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialRewardsReportComponent } from './special-rewards-report.component';

describe('SpecialRewardsReportComponent', () => {
  let component: SpecialRewardsReportComponent;
  let fixture: ComponentFixture<SpecialRewardsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialRewardsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialRewardsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
