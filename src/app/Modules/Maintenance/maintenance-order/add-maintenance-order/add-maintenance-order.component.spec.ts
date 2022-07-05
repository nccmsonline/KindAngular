import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaintenanceOrderComponent } from './add-maintenance-order.component';

describe('AddMaintenanceOrderComponent', () => {
  let component: AddMaintenanceOrderComponent;
  let fixture: ComponentFixture<AddMaintenanceOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMaintenanceOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMaintenanceOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
