import { TestBed } from '@angular/core/testing';

import { dialogService } from './dialog.service';

describe('dialogService', () => {
  let service: dialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(dialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
