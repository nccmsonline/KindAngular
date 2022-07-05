import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeStatusPopupComponent } from './resume-status-popup.component';

describe('ResumeStatusPopupComponent', () => {
  let component: ResumeStatusPopupComponent;
  let fixture: ComponentFixture<ResumeStatusPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeStatusPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeStatusPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
