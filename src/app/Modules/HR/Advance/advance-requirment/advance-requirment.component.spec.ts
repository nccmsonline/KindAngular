import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceRequirmentComponent } from './advance-requirment.component';

describe('AdvanceRequirmentComponent', () => {
  let component: AdvanceRequirmentComponent;
  let fixture: ComponentFixture<AdvanceRequirmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceRequirmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceRequirmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
