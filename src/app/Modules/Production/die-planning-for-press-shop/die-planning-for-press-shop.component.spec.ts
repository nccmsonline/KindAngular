import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiePlanningForPressShopComponent } from './die-planning-for-press-shop.component';

describe('DiePlanningForPressShopComponent', () => {
  let component: DiePlanningForPressShopComponent;
  let fixture: ComponentFixture<DiePlanningForPressShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiePlanningForPressShopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiePlanningForPressShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
