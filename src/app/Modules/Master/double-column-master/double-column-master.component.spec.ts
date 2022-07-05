import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleColumnMasterComponent } from './double-column-master.component';

describe('DoubleColumnMasterComponent', () => {
  let component: DoubleColumnMasterComponent;
  let fixture: ComponentFixture<DoubleColumnMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoubleColumnMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoubleColumnMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
