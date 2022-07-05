import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPreventiveMaintTempleteComponent } from './print-preventive-maint-templete.component';

describe('PrintPreventiveMaintTempleteComponent', () => {
  let component: PrintPreventiveMaintTempleteComponent;
  let fixture: ComponentFixture<PrintPreventiveMaintTempleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintPreventiveMaintTempleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPreventiveMaintTempleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
