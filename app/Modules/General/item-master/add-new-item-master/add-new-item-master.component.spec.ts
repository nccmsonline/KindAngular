import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewItemMasterComponent } from './add-new-item-master.component';

describe('AddNewItemMasterComponent', () => {
  let component: AddNewItemMasterComponent;
  let fixture: ComponentFixture<AddNewItemMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewItemMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewItemMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
