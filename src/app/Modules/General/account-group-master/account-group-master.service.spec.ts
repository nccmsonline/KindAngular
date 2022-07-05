import { TestBed, inject } from '@angular/core/testing';

import { AccountGroupMasterService } from './account-group-master.service';

describe('AccountGroupMasterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountGroupMasterService]
    });
  });

  it('should be created', inject([AccountGroupMasterService], (service: AccountGroupMasterService) => {
    expect(service).toBeTruthy();
  }));
});
