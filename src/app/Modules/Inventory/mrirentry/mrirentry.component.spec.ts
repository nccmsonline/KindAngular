import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MRIREntryComponent } from './mrirentry.component';

describe('MRIREntryComponent', () => {
  let component: MRIREntryComponent;
  let fixture: ComponentFixture<MRIREntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MRIREntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MRIREntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
