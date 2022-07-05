import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSingleColumnMasterComponent } from './add-single-column-master.component';

describe('AddSingleColumnMasterComponent', () => {
  let component: AddSingleColumnMasterComponent;
  let fixture: ComponentFixture<AddSingleColumnMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSingleColumnMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSingleColumnMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
