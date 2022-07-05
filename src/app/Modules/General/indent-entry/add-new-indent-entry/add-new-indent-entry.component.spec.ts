import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewIndentEntryComponent } from './add-new-indent-entry.component';

describe('AddNewIndentEntryComponent', () => {
  let component: AddNewIndentEntryComponent;
  let fixture: ComponentFixture<AddNewIndentEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewIndentEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewIndentEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
