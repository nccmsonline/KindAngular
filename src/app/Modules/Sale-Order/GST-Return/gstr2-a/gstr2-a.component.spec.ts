import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GSTR2AComponent } from './gstr2-a.component';

describe('GSTR2AComponent', () => {
  let component: GSTR2AComponent;
  let fixture: ComponentFixture<GSTR2AComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GSTR2AComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GSTR2AComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
