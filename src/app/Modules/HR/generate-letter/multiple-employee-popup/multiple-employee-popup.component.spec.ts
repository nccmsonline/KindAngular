import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleEmployeePopupComponent } from './multiple-employee-popup.component';

describe('MultipleEmployeePopupComponent', () => {
  let component: MultipleEmployeePopupComponent;
  let fixture: ComponentFixture<MultipleEmployeePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleEmployeePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleEmployeePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
