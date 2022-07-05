import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialMovementSlipOutwardComponent } from './material-movement-slip-outward.component';

describe('MaterialMovementSlipOutwardComponent', () => {
  let component: MaterialMovementSlipOutwardComponent;
  let fixture: ComponentFixture<MaterialMovementSlipOutwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialMovementSlipOutwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialMovementSlipOutwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
