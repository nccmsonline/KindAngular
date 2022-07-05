import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OTSumaryComponent } from './ot-sumary.component';

describe('OTSumaryComponent', () => {
  let component: OTSumaryComponent;
  let fixture: ComponentFixture<OTSumaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OTSumaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OTSumaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
