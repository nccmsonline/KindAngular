import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieMasterComponent } from './die-master.component';

describe('DieMasterComponent', () => {
  let component: DieMasterComponent;
  let fixture: ComponentFixture<DieMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DieMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DieMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
