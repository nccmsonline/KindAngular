import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiePlanningForPressShopComponent } from './add-die-planning-for-press-shop.component';

describe('AddDiePlanningForPressShopComponent', () => {
  let component: AddDiePlanningForPressShopComponent;
  let fixture: ComponentFixture<AddDiePlanningForPressShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDiePlanningForPressShopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDiePlanningForPressShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
