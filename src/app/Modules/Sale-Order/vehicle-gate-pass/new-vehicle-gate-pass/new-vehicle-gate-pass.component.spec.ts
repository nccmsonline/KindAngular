import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVehicleGatePassComponent } from './new-vehicle-gate-pass.component';

describe('NewVehicleGatePassComponent', () => {
  let component: NewVehicleGatePassComponent;
  let fixture: ComponentFixture<NewVehicleGatePassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVehicleGatePassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVehicleGatePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
