import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumePrintComponent } from './resume-print.component';

describe('ResumePrintComponent', () => {
  let component: ResumePrintComponent;
  let fixture: ComponentFixture<ResumePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumePrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
