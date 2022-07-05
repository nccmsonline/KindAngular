import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewDieComponent } from './add-new-die.component';

describe('AddNewDieComponent', () => {
  let component: AddNewDieComponent;
  let fixture: ComponentFixture<AddNewDieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewDieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewDieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
