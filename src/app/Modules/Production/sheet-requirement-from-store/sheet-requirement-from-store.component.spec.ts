import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetRequirementFromStoreComponent } from './sheet-requirement-from-store.component';

describe('SheetRequirementFromStoreComponent', () => {
  let component: SheetRequirementFromStoreComponent;
  let fixture: ComponentFixture<SheetRequirementFromStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetRequirementFromStoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetRequirementFromStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
