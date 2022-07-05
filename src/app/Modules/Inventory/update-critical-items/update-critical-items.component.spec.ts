import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCriticalItemsComponent } from './update-critical-items.component';

describe('UpdateCriticalItemsComponent', () => {
  let component: UpdateCriticalItemsComponent;
  let fixture: ComponentFixture<UpdateCriticalItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCriticalItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCriticalItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
