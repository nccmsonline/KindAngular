import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DieAndToolComponent } from './die-and-tool.component';

describe('DieAndToolComponent', () => {
  let component: DieAndToolComponent;
  let fixture: ComponentFixture<DieAndToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DieAndToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DieAndToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
