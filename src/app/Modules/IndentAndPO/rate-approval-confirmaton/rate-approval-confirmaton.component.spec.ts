import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateApprovalConfirmatonComponent } from './rate-approval-confirmaton.component';

describe('RateApprovalConfirmatonComponent', () => {
  let component: RateApprovalConfirmatonComponent;
  let fixture: ComponentFixture<RateApprovalConfirmatonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateApprovalConfirmatonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateApprovalConfirmatonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
