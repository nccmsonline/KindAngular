import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeftFormatComponent } from './neft-format.component';

describe('NeftFormatComponent', () => {
  let component: NeftFormatComponent;
  let fixture: ComponentFixture<NeftFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeftFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeftFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
