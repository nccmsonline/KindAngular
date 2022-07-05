import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverTimePassingForMoreThan2Component } from './over-time-passing-for-more-than2.component';

describe('OverTimePassingForMoreThan2Component', () => {
  let component: OverTimePassingForMoreThan2Component;
  let fixture: ComponentFixture<OverTimePassingForMoreThan2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverTimePassingForMoreThan2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverTimePassingForMoreThan2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
