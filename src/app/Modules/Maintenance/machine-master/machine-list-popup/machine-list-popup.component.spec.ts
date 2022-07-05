import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineListPopupComponent } from './machine-list-popup.component';

describe('MachineListPopupComponent', () => {
  let component: MachineListPopupComponent;
  let fixture: ComponentFixture<MachineListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineListPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
