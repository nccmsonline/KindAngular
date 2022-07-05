import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewItemTypeComponent } from './add-new-item-type.component';

describe('AddNewItemTypeComponent', () => {
  let component: AddNewItemTypeComponent;
  let fixture: ComponentFixture<AddNewItemTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewItemTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewItemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
