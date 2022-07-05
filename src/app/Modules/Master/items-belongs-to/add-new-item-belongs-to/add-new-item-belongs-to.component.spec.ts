import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewItemBelongsToComponent } from './add-new-item-belongs-to.component';

describe('AddNewItemBelongsToComponent', () => {
  let component: AddNewItemBelongsToComponent;
  let fixture: ComponentFixture<AddNewItemBelongsToComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewItemBelongsToComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewItemBelongsToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
