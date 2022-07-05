import { TestBed, inject } from '@angular/core/testing';

import { EmployeeMasterService } from './employee-master.service';

describe('EmployeeMasterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeMasterService]
    });
  });

  it('should be created', inject([EmployeeMasterService], (service: EmployeeMasterService) => {
    expect(service).toBeTruthy();
  }));
});
