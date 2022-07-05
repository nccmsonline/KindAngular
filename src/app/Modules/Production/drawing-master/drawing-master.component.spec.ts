import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingMasterComponent } from './drawing-master.component';

describe('DrawingMasterComponent', () => {
  let component: DrawingMasterComponent;
  let fixture: ComponentFixture<DrawingMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawingMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
