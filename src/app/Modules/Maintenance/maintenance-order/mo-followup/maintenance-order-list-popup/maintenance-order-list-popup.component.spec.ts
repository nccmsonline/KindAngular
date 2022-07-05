import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceOrderListPopupComponent } from './maintenance-order-list-popup.component';

describe('MaintenanceOrderListPopupComponent', () => {
  let component: MaintenanceOrderListPopupComponent;
  let fixture: ComponentFixture<MaintenanceOrderListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceOrderListPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceOrderListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
