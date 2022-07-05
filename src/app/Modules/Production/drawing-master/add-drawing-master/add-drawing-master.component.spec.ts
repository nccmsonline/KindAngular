import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDrawingMasterComponent } from './add-drawing-master.component';

describe('AddDrawingMasterComponent', () => {
  let component: AddDrawingMasterComponent;
  let fixture: ComponentFixture<AddDrawingMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDrawingMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDrawingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
