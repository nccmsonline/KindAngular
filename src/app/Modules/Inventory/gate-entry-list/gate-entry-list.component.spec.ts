import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GateEntryListComponent } from './gate-entry-list.component';

describe('GateEntryListComponent', () => {
  let component: GateEntryListComponent;
  let fixture: ComponentFixture<GateEntryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GateEntryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GateEntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
