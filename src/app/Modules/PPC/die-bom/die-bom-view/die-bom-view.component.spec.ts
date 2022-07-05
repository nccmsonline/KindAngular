import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieBomViewComponent } from './die-bom-view.component';

describe('DieBomViewComponent', () => {
  let component: DieBomViewComponent;
  let fixture: ComponentFixture<DieBomViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DieBomViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DieBomViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
