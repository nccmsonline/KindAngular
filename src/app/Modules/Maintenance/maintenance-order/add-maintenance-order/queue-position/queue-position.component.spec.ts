import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueuePositionComponent } from './queue-position.component';

describe('QueuePositionComponent', () => {
  let component: QueuePositionComponent;
  let fixture: ComponentFixture<QueuePositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueuePositionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueuePositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
