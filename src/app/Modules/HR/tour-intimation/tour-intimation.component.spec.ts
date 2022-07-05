import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourIntimationComponent } from './tour-intimation.component';

describe('TourIntimationComponent', () => {
  let component: TourIntimationComponent;
  let fixture: ComponentFixture<TourIntimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourIntimationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourIntimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
