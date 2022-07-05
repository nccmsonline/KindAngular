import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirmentFolloupComponent } from './requirment-folloup.component';

describe('RequirmentFolloupComponent', () => {
  let component: RequirmentFolloupComponent;
  let fixture: ComponentFixture<RequirmentFolloupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirmentFolloupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirmentFolloupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
