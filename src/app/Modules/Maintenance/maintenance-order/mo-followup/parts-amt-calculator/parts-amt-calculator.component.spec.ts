import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsAmtCalculatorComponent } from './parts-amt-calculator.component';

describe('PartsAmtCalculatorComponent', () => {
  let component: PartsAmtCalculatorComponent;
  let fixture: ComponentFixture<PartsAmtCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartsAmtCalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartsAmtCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
