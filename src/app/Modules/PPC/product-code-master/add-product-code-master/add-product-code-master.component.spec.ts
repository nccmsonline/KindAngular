import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductCodeMasterComponent } from './add-product-code-master.component';

describe('AddProductCodeMasterComponent', () => {
  let component: AddProductCodeMasterComponent;
  let fixture: ComponentFixture<AddProductCodeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductCodeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductCodeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
