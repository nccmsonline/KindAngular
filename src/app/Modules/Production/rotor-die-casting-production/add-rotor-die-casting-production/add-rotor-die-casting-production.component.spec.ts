import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRotorDieCastingProductionComponent } from './add-rotor-die-casting-production.component';

describe('AddRotorDieCastingProductionComponent', () => {
  let component: AddRotorDieCastingProductionComponent;
  let fixture: ComponentFixture<AddRotorDieCastingProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRotorDieCastingProductionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRotorDieCastingProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
