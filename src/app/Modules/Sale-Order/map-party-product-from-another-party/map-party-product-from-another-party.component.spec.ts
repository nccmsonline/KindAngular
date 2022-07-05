import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPartyProductFromAnotherPartyComponent } from './map-party-product-from-another-party.component';

describe('MapPartyProductFromAnotherPartyComponent', () => {
  let component: MapPartyProductFromAnotherPartyComponent;
  let fixture: ComponentFixture<MapPartyProductFromAnotherPartyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPartyProductFromAnotherPartyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPartyProductFromAnotherPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
