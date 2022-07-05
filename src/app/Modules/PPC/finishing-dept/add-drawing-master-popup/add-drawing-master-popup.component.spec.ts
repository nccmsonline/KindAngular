import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDrawingMasterPopupComponent } from './add-drawing-master-popup.component';

describe('AddDrawingMasterPopupComponent', () => {
  let component: AddDrawingMasterPopupComponent;
  let fixture: ComponentFixture<AddDrawingMasterPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDrawingMasterPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDrawingMasterPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
