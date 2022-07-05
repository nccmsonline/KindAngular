import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoRegisterComponent } from './mo-register.component';

describe('MoRegisterComponent', () => {
  let component: MoRegisterComponent;
  let fixture: ComponentFixture<MoRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
