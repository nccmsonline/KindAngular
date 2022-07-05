import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewItemSubCategoryComponent } from './add-new-item-sub-category.component';

describe('AddNewItemSubCategoryComponent', () => {
  let component: AddNewItemSubCategoryComponent;
  let fixture: ComponentFixture<AddNewItemSubCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewItemSubCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewItemSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
