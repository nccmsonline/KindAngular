import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinshingBOMComponent } from './finshing-bom.component';

describe('FinshingBOMComponent', () => {
  let component: FinshingBOMComponent;
  let fixture: ComponentFixture<FinshingBOMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinshingBOMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinshingBOMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
