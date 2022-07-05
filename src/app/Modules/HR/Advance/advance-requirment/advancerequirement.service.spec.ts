import { TestBed, inject } from '@angular/core/testing';

import { AdvancerequirementService } from './advancerequirement.service';

describe('AdvancerequirementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdvancerequirementService]
    });
  });

  it('should be created', inject([AdvancerequirementService], (service: AdvancerequirementService) => {
    expect(service).toBeTruthy();
  }));
});
