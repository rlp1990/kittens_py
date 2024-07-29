import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { KittensService } from '../services/kittens.service';
import { Observable, of } from 'rxjs';
import { kittenDetailsResolver, kittensResolver } from './kittens.resolver';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { KittenModel } from '../models/kittens.model';
import { kittensMock } from '../mocks/kittens.mock';

const MOCK_KITTENS_SERVICE = {
  getAll: jest.fn(),
  getKittenById: jest.fn(),
};

describe('KittensResolver', () => {
  let service: KittensService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: KittensService, useValue: MOCK_KITTENS_SERVICE }],
    });
    service = TestBed.inject(KittensService);
  });

  it('should call getAll', fakeAsync(() => {
    MOCK_KITTENS_SERVICE.getAll.mockReturnValue(of([]));
    const resolver: Observable<KittenModel[]> = TestBed.runInInjectionContext(
      () =>
        kittensResolver(
          {} as ActivatedRouteSnapshot,
          {} as RouterStateSnapshot,
        ),
    ) as Observable<KittenModel[]>;
    resolver.subscribe((response) => {
      expect(response).toStrictEqual([]);
    });
    tick();
    expect(MOCK_KITTENS_SERVICE.getAll).toHaveBeenCalled();
  }));

  it('should call getKittenById', fakeAsync(() => {
    MOCK_KITTENS_SERVICE.getKittenById.mockReturnValue(of(kittensMock[0]));
    const resolver: Observable<KittenModel> = TestBed.runInInjectionContext(
      () =>
        kittenDetailsResolver(
          {
            paramMap: new Map([['id', '1']]),
          } as unknown as ActivatedRouteSnapshot,
          {} as RouterStateSnapshot,
        ),
    ) as Observable<KittenModel>;
    resolver.subscribe((response) => {
      expect(response).toStrictEqual(kittensMock[0]);
    });
    tick();
    expect(MOCK_KITTENS_SERVICE.getKittenById).toHaveBeenCalledWith('1');
  }));
});
