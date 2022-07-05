import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDayWiseDieMaintComponent } from './print-day-wise-die-maint.component';

describe('PrintDayWiseDieMaintComponent', () => {
  let component: PrintDayWiseDieMaintComponent;
  let fixture: ComponentFixture<PrintDayWiseDieMaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDayWiseDieMaintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDayWiseDieMaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
