import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderReportComponent } from './sale-order-report.component';

describe('SaleOrderReportComponent', () => {
  let component: SaleOrderReportComponent;
  let fixture: ComponentFixture<SaleOrderReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleOrderReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleOrderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
