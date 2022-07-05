import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotorDieCastingProductionComponent } from './rotor-die-casting-production.component';

describe('RotorDieCastingProductionComponent', () => {
  let component: RotorDieCastingProductionComponent;
  let fixture: ComponentFixture<RotorDieCastingProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RotorDieCastingProductionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RotorDieCastingProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
