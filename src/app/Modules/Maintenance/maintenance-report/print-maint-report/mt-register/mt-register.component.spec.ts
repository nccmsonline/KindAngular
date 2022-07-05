import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtRegisterComponent } from './mt-register.component';

describe('MtRegisterComponent', () => {
  let component: MtRegisterComponent;
  let fixture: ComponentFixture<MtRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MtRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
