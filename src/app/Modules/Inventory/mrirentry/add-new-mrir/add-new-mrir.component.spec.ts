import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewMRIRComponent } from './add-new-mrir.component';

describe('AddNewMRIRComponent', () => {
  let component: AddNewMRIRComponent;
  let fixture: ComponentFixture<AddNewMRIRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewMRIRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewMRIRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
