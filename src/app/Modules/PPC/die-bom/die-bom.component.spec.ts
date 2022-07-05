import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieBomComponent } from './die-bom.component';

describe('DieBomComponent', () => {
  let component: DieBomComponent;
  let fixture: ComponentFixture<DieBomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DieBomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DieBomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
