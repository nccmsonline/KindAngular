import { TestBed, inject } from '@angular/core/testing';

import { IssuanceSlipService } from './issuance-slip.service';

describe('IssuanceSlipService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IssuanceSlipService]
    });
  });

  it('should be created', inject([IssuanceSlipService], (service: IssuanceSlipService) => {
    expect(service).toBeTruthy();
  }));
});
