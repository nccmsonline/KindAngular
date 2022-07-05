import { TestBed, inject } from '@angular/core/testing';

import { FileDownloadUploadService } from './file-download-upload.service';

describe('FileDownloadUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileDownloadUploadService]
    });
  });

  it('should be created', inject([FileDownloadUploadService], (service: FileDownloadUploadService) => {
    expect(service).toBeTruthy();
  }));
});
