import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDoubleColumnMasterComponent } from './add-double-column-master.component';

describe('AddDoubleColumnMasterComponent', () => {
  let component: AddDoubleColumnMasterComponent;
  let fixture: ComponentFixture<AddDoubleColumnMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDoubleColumnMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDoubleColumnMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
