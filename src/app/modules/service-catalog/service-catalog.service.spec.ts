import { TestBed, inject } from '@angular/core/testing';

import { ServiceCatalogService } from './service-catalog.service';

describe('ServiceCatalogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceCatalogService]
    });
  });

  it('should ...', inject([ServiceCatalogService], (service: ServiceCatalogService) => {
    expect(service).toBeTruthy();
  }));
});
