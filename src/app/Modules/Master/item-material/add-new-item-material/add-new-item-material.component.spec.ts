import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewItemMaterialComponent } from './add-new-item-material.component';

describe('AddNewItemMaterialComponent', () => {
  let component: AddNewItemMaterialComponent;
  let fixture: ComponentFixture<AddNewItemMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewItemMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewItemMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
