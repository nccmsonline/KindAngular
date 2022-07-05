import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HRReportsComponent } from './hrreports.component';

describe('HRReportsComponent', () => {
  let component: HRReportsComponent;
  let fixture: ComponentFixture<HRReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HRReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HRReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
