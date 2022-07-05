import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleColumnMasterComponent } from './single-column-master.component';

describe('SingleColumnMasterComponent', () => {
  let component: SingleColumnMasterComponent;
  let fixture: ComponentFixture<SingleColumnMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleColumnMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleColumnMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
