import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewGateEntryComponent } from './add-new-gate-entry.component';

describe('AddNewGateEntryComponent', () => {
  let component: AddNewGateEntryComponent;
  let fixture: ComponentFixture<AddNewGateEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewGateEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewGateEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
