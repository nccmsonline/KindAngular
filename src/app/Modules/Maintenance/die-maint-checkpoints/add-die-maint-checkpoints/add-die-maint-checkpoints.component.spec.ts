import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDieMaintCheckpointsComponent } from './add-die-maint-checkpoints.component';

describe('AddDieMaintCheckpointsComponent', () => {
  let component: AddDieMaintCheckpointsComponent;
  let fixture: ComponentFixture<AddDieMaintCheckpointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDieMaintCheckpointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDieMaintCheckpointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
