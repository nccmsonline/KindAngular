import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageOTListComponent } from './package-otlist.component';

describe('PackageOTListComponent', () => {
  let component: PackageOTListComponent;
  let fixture: ComponentFixture<PackageOTListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageOTListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageOTListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
