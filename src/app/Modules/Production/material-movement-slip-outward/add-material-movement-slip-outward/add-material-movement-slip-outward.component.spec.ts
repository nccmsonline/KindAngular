import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaterialMovementSlipOutwardComponent } from './add-material-movement-slip-outward.component';

describe('AddMaterialMovementSlipOutwardComponent', () => {
  let component: AddMaterialMovementSlipOutwardComponent;
  let fixture: ComponentFixture<AddMaterialMovementSlipOutwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMaterialMovementSlipOutwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMaterialMovementSlipOutwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
