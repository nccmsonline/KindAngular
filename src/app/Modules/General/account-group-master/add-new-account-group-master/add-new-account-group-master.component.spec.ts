import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAccountGroupMasterComponent } from './add-new-account-group-master.component';

describe('AddNewAccountGroupMasterComponent', () => {
  let component: AddNewAccountGroupMasterComponent;
  let fixture: ComponentFixture<AddNewAccountGroupMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewAccountGroupMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewAccountGroupMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
