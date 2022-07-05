import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniqueItemCodificationMappingComponent } from './unique-item-codification-mapping.component';

describe('UniqueItemCodificationMappingComponent', () => {
  let component: UniqueItemCodificationMappingComponent;
  let fixture: ComponentFixture<UniqueItemCodificationMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniqueItemCodificationMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UniqueItemCodificationMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
