import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrCrNoteViewComponent } from './dr-cr-note-view.component';

describe('DrCrNoteViewComponent', () => {
  let component: DrCrNoteViewComponent;
  let fixture: ComponentFixture<DrCrNoteViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrCrNoteViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrCrNoteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
