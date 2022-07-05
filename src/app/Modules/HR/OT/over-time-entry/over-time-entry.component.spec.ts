import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverTimeEntryComponent } from './over-time-entry.component';

describe('OverTimeEntryComponent', () => {
  let component: OverTimeEntryComponent;
  let fixture: ComponentFixture<OverTimeEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverTimeEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverTimeEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
