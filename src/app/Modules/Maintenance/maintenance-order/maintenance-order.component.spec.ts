import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceOrderComponent } from './maintenance-order.component';

describe('MaintenanceOrderComponent', () => {
  let component: MaintenanceOrderComponent;
  let fixture: ComponentFixture<MaintenanceOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
