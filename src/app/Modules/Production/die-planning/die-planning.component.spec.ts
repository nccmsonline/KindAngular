import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiePlanningComponent } from './die-planning.component';

describe('DiePlanningComponent', () => {
  let component: DiePlanningComponent;
  let fixture: ComponentFixture<DiePlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiePlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
