import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieMaintCheckpointsComponent } from './die-maint-checkpoints.component';

describe('DieMaintCheckpointsComponent', () => {
  let component: DieMaintCheckpointsComponent;
  let fixture: ComponentFixture<DieMaintCheckpointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DieMaintCheckpointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DieMaintCheckpointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
