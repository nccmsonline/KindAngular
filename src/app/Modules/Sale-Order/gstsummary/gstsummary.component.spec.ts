import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GSTSummaryComponent } from './gstsummary.component';

describe('GSTSummaryComponent', () => {
  let component: GSTSummaryComponent;
  let fixture: ComponentFixture<GSTSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GSTSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GSTSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
