import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildItemsPopupComponent } from './child-items-popup.component';

describe('ChildItemsPopupComponent', () => {
  let component: ChildItemsPopupComponent;
  let fixture: ComponentFixture<ChildItemsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildItemsPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildItemsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
