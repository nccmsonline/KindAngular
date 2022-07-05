import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreIndentComponent } from './store-indent.component';

describe('StoreIndentComponent', () => {
  let component: StoreIndentComponent;
  let fixture: ComponentFixture<StoreIndentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreIndentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
