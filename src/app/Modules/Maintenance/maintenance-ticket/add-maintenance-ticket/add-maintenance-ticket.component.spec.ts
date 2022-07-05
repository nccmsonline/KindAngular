import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaintenanceTicketComponent } from './add-maintenance-ticket.component';

describe('AddMaintenanceTicketComponent', () => {
  let component: AddMaintenanceTicketComponent;
  let fixture: ComponentFixture<AddMaintenanceTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMaintenanceTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMaintenanceTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
