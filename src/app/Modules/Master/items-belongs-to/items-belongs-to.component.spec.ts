import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsBelongsToComponent } from './items-belongs-to.component';

describe('ItemsBelongsToComponent', () => {
  let component: ItemsBelongsToComponent;
  let fixture: ComponentFixture<ItemsBelongsToComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsBelongsToComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsBelongsToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
