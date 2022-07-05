import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeftFormatMasterComponent } from './neft-format-master.component';

describe('NeftFormatMasterComponent', () => {
  let component: NeftFormatMasterComponent;
  let fixture: ComponentFixture<NeftFormatMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeftFormatMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeftFormatMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
