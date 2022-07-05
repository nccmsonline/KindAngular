import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetMetalReceivedComponent } from './sheet-metal-received.component';

describe('SheetMetalReceivedComponent', () => {
  let component: SheetMetalReceivedComponent;
  let fixture: ComponentFixture<SheetMetalReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetMetalReceivedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetMetalReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
