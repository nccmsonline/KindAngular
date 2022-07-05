import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSupplierMasterComponent } from './add-new-supplier-master.component';

describe('AddNewSupplierMasterComponent', () => {
  let component: AddNewSupplierMasterComponent;
  let fixture: ComponentFixture<AddNewSupplierMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewSupplierMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewSupplierMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
