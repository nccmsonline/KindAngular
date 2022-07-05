import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassedOTListComponent } from './passed-otlist.component';

describe('PassedOTListComponent', () => {
  let component: PassedOTListComponent;
  let fixture: ComponentFixture<PassedOTListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassedOTListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassedOTListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
