import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSheetMetalReceivedComponent } from './add-sheet-metal-received.component';

describe('AddSheetMetalReceivedComponent', () => {
  let component: AddSheetMetalReceivedComponent;
  let fixture: ComponentFixture<AddSheetMetalReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSheetMetalReceivedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSheetMetalReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
