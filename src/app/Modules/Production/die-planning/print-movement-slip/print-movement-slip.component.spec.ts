import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintMovementSlipComponent } from './print-movement-slip.component';

describe('PrintMovementSlipComponent', () => {
  let component: PrintMovementSlipComponent;
  let fixture: ComponentFixture<PrintMovementSlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintMovementSlipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintMovementSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
