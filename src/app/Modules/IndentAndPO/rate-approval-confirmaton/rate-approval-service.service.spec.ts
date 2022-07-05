import { TestBed, inject } from '@angular/core/testing';

import { RateApprovalServiceService } from './rate-approval-service.service';

describe('RateApprovalServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RateApprovalServiceService]
    });
  });

  it('should be created', inject([RateApprovalServiceService], (service: RateApprovalServiceService) => {
    expect(service).toBeTruthy();
  }));
});
