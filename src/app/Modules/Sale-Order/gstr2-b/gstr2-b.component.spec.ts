import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GSTR2BComponent } from './gstr2-b.component';

describe('GSTR2BComponent', () => {
  let component: GSTR2BComponent;
  let fixture: ComponentFixture<GSTR2BComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GSTR2BComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GSTR2BComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
