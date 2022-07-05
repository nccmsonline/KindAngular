import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieDimensionSheetComponent } from './die-dimension-sheet.component';

describe('DieDimensionSheetComponent', () => {
  let component: DieDimensionSheetComponent;
  let fixture: ComponentFixture<DieDimensionSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DieDimensionSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DieDimensionSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
