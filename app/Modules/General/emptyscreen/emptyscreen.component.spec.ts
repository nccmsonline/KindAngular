import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyscreenComponent } from './emptyscreen.component';

describe('EmptyscreenComponent', () => {
  let component: EmptyscreenComponent;
  let fixture: ComponentFixture<EmptyscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyscreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
