import { TestBed, inject } from '@angular/core/testing';

import { StandardFunctionService } from './standard-function.service';

describe('StandardFunctionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StandardFunctionService]
    });
  });

  it('should be created', inject([StandardFunctionService], (service: StandardFunctionService) => {
    expect(service).toBeTruthy();
  }));
});
