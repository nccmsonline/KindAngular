import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSheetRequirementFromStoreComponent } from './add-sheet-requirement-from-store.component';

describe('AddSheetRequirementFromStoreComponent', () => {
  let component: AddSheetRequirementFromStoreComponent;
  let fixture: ComponentFixture<AddSheetRequirementFromStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSheetRequirementFromStoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSheetRequirementFromStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
