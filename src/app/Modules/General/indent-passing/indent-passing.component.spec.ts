import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentPassingComponent } from './indent-passing.component';

describe('IndentPassingComponent', () => {
  let component: IndentPassingComponent;
  let fixture: ComponentFixture<IndentPassingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndentPassingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndentPassingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
