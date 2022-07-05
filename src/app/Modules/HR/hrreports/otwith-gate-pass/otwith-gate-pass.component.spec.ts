import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OTWithGatePassComponent } from './otwith-gate-pass.component';

describe('OTWithGatePassComponent', () => {
  let component: OTWithGatePassComponent;
  let fixture: ComponentFixture<OTWithGatePassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OTWithGatePassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OTWithGatePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
