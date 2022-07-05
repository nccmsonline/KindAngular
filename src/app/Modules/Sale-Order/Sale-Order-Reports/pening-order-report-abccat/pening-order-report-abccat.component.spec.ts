import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeningOrderReportABCCatComponent } from './pening-order-report-abccat.component';

describe('PeningOrderReportABCCatComponent', () => {
  let component: PeningOrderReportABCCatComponent;
  let fixture: ComponentFixture<PeningOrderReportABCCatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeningOrderReportABCCatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeningOrderReportABCCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
