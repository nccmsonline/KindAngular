import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewTourIntimationComponent } from './add-new-tour-intimation.component';

describe('AddNewTourIntimationComponent', () => {
  let component: AddNewTourIntimationComponent;
  let fixture: ComponentFixture<AddNewTourIntimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewTourIntimationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewTourIntimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
