import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverTimeAmendmentComponent } from './over-time-amendment.component';

describe('OverTimeAmendmentComponent', () => {
  let component: OverTimeAmendmentComponent;
  let fixture: ComponentFixture<OverTimeAmendmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverTimeAmendmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverTimeAmendmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
