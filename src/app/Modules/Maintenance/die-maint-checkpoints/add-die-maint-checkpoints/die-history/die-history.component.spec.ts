import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieHistoryComponent } from './die-history.component';

describe('DieHistoryComponent', () => {
  let component: DieHistoryComponent;
  let fixture: ComponentFixture<DieHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DieHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DieHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
