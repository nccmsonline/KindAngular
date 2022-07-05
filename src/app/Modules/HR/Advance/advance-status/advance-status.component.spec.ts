import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceStatusComponent } from './advance-status.component';

describe('AdvanceStatusComponent', () => {
  let component: AdvanceStatusComponent;
  let fixture: ComponentFixture<AdvanceStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
