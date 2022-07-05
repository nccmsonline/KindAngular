import { TestBed, inject } from '@angular/core/testing';

import { IndentpassingService } from './indentpassing.service';

describe('IndentpassingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IndentpassingService]
    });
  });

  it('should be created', inject([IndentpassingService], (service: IndentpassingService) => {
    expect(service).toBeTruthy();
  }));
});
