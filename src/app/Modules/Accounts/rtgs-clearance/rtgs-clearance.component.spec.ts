import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RTGSClearanceComponent } from './rtgs-clearance.component';

describe('RTGSClearanceComponent', () => {
  let component: RTGSClearanceComponent;
  let fixture: ComponentFixture<RTGSClearanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RTGSClearanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RTGSClearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
