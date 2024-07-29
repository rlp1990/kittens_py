import { TestBed } from '@angular/core/testing';
import { KittensService } from './kittens.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MockProvider } from 'ng-mocks';
import { Router } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { kittensMock } from '../mocks/kittens.mock';
import { KittenModel } from '../models/kittens.model';
import { NzMessageService } from 'ng-zorro-antd/message';

describe('KittensService', () => {
  let service: KittensService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        KittensService,
        { provide: 'BASE_API_URL', useValue: 'api' },
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProvider(Router, { navigate: () => {} }, 'useValue'),
        MockProvider(NzMessageService, { error: () => {} }, 'useValue'),
      ],
    }).compileComponents();
    service = TestBed.inject(KittensService);
  });
  it('should call get kittens', (done) => {
    const spy = jest
      .spyOn(service['http'], 'get')
      .mockReturnValueOnce(of([kittensMock[0]]));
    service.getAll().subscribe((kittens) => {
      expect(spy).toHaveBeenCalledWith(`api/kittens`);
      expect(kittens).toStrictEqual([new KittenModel(kittensMock[0])]);
      done();
    });
  });

  it('should call get kitten by id', (done) => {
    const spy = jest
      .spyOn(service['http'], 'get')
      .mockReturnValueOnce(of(kittensMock[0]));
    service.getKittenById('1').subscribe((kittens) => {
      expect(spy).toHaveBeenCalledWith(`api/kittens/1`);
      expect(kittens).toStrictEqual(new KittenModel(kittensMock[0]));
      done();
    });
  });

  it('should call create kitten', () => {
    const spy = jest
      .spyOn(service['http'], 'post')
      .mockReturnValueOnce(of(kittensMock[0]));
    const routerSpy = jest.spyOn(service['router'], 'navigate');
    const kittenMock = new KittenModel(kittensMock[0]);
    const { id: _, ...newKittenMock } = kittenMock;
    service['upsertKitten'](newKittenMock);
    const { id, ...newKitten } = kittenMock;
    expect(spy).toHaveBeenCalledWith(`api/kittens/`, {
      ...newKitten,
      image_url: kittenMock.image_url?.replace('images/', ''),
    });
    expect(routerSpy).toHaveBeenCalledWith(['./']);
  });

  it('should call update kitten', () => {
    const spy = jest
      .spyOn(service['http'], 'put')
      .mockReturnValueOnce(of(kittensMock[0]));
    const routerSpy = jest.spyOn(service['router'], 'navigate');
    const kittenMock = new KittenModel(kittensMock[0]);
    service['upsertKitten'](kittenMock);
    expect(spy).toHaveBeenCalledWith(`api/kittens/${kittenMock.id}`, {
      ...kittenMock,
      image_url: kittenMock.image_url?.replace('images/', ''),
    });
    expect(routerSpy).toHaveBeenCalledWith(['/kittens/1']);
  });

  it('should call delete kitten', () => {
    const spy = jest
      .spyOn(service['http'], 'delete')
      .mockReturnValueOnce(of(kittensMock[0]));
    const routerSpy = jest.spyOn(service['router'], 'navigate');
    service['deleteKitten']('1');
    expect(spy).toHaveBeenCalledWith(`api/kittens/1`);
    expect(routerSpy).toHaveBeenCalledWith(['./']);
  });

  it('should call _favoriteKittenIds$.next for add to favorites', () => {
    const spy = jest.spyOn(service['_favoriteKittenIds$'], 'next');
    service['addKittenToFavorites']('1');
    expect(service['favoriteKittenIds']).toStrictEqual(['1']);
    expect(spy).toHaveBeenCalledWith(['1']);
  });

  it('should call _favoriteKittenIds$.next for remove from favorites', () => {
    service['favoriteKittenIds'] = ['1'];
    service['_favoriteKittenIds$'] = new BehaviorSubject(['1']);
    const spy = jest.spyOn(service['_favoriteKittenIds$'], 'next');
    service['removeKittenFromFavorites']('1');
    expect(service['favoriteKittenIds']).toStrictEqual([]);
    expect(spy).toHaveBeenCalledWith([]);
  });

  it('should return favorite kittens', () => {
    service['_favoriteKittenIds$'] = new BehaviorSubject(['1']);
    service.favoriteKittenIds$.subscribe((kittenIds) => {
      expect(kittenIds).toStrictEqual(['1']);
    });
  });

  it('should call create kitten with error', () => {
    const spy = jest
      .spyOn(service['http'], 'post')
      .mockReturnValueOnce(throwError(() => new Error('error')));
    const messageSpy = jest.spyOn(service['messageService'], 'error');
    const kittenMock = new KittenModel(kittensMock[0]);
    const { id: _, ...newKittenMock } = kittenMock;
    service['upsertKitten'](newKittenMock);
    const { id, ...newKitten } = kittenMock;
    expect(spy).toHaveBeenCalledWith(`api/kittens/`, {
      ...newKitten,
      image_url: kittenMock.image_url?.replace('images/', ''),
    });
    expect(service['messageService'].error).toHaveBeenCalledWith('error');
  });

  it('should call update kitten with error', () => {
    const spy = jest
      .spyOn(service['http'], 'put')
      .mockReturnValueOnce(throwError(() => new Error('error')));
    const messageSpy = jest.spyOn(service['messageService'], 'error');
    const kittenMock = new KittenModel(kittensMock[0]);
    service['upsertKitten'](kittenMock);
    expect(spy).toHaveBeenCalledWith(`api/kittens/${kittenMock.id}`, {
      ...kittenMock,
      image_url: kittenMock.image_url?.replace('images/', ''),
    });
    expect(service['messageService'].error).toHaveBeenCalledWith('error');
  });

  it('should call delete kitten with error', () => {
    const spy = jest
      .spyOn(service['http'], 'delete')
      .mockReturnValueOnce(throwError(() => new Error('error')));
    const messageSpy = jest.spyOn(service['messageService'], 'error');
    service['deleteKitten']('1');
    expect(spy).toHaveBeenCalledWith(`api/kittens/1`);
    expect(service['messageService'].error).toHaveBeenCalledWith('error');
  });

  it('should NOT remove images/ from image_url', () => {
    const spy = jest.spyOn(service, 'updateKitten' as any);
    const kittenMock = new KittenModel(kittensMock[0]);
    kittenMock.image_url = 'static/kitten-1.jpg';
    service.upsertKitten(kittenMock);
    expect(spy).toHaveBeenCalledWith({
      ...kittenMock,
      image_url: 'static/kitten-1.jpg',
    });
  });
});
