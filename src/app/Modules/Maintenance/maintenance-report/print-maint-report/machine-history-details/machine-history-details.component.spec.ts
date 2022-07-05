import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineHistoryDetailsComponent } from './machine-history-details.component';

describe('MachineHistoryDetailsComponent', () => {
  let component: MachineHistoryDetailsComponent;
  let fixture: ComponentFixture<MachineHistoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineHistoryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
