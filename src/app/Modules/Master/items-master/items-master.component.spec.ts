import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsMasterComponent } from './items-master.component';

describe('ItemsMasterComponent', () => {
  let component: ItemsMasterComponent;
  let fixture: ComponentFixture<ItemsMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
