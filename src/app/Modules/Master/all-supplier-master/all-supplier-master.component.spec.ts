import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSupplierMasterComponent } from './all-supplier-master.component';

describe('AllSupplierMasterComponent', () => {
  let component: AllSupplierMasterComponent;
  let fixture: ComponentFixture<AllSupplierMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllSupplierMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllSupplierMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
