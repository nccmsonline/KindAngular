import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleGatePassComponent } from './vehicle-gate-pass.component';

describe('VehicleGatePassComponent', () => {
  let component: VehicleGatePassComponent;
  let fixture: ComponentFixture<VehicleGatePassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleGatePassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleGatePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
