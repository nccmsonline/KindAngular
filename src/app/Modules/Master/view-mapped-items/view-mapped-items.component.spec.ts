import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMappedItemsComponent } from './view-mapped-items.component';

describe('ViewMappedItemsComponent', () => {
  let component: ViewMappedItemsComponent;
  let fixture: ComponentFixture<ViewMappedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMappedItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMappedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
