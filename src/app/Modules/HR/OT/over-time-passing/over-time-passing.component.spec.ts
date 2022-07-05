import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverTimePassingComponent } from './over-time-passing.component';

describe('OverTimePassingComponent', () => {
  let component: OverTimePassingComponent;
  let fixture: ComponentFixture<OverTimePassingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverTimePassingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverTimePassingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
