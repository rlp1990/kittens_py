import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { MockComponent, MockModule, MockPipe, MockProvider } from 'ng-mocks';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AsyncPipe } from '@angular/common';
import { FavoriteDirective } from '../../directives/favourite.directive';
import { KittenModel } from '../../models/kittens.model';
import { kittensMock } from '../../mocks/kittens.mock';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { KittenEditComponent } from '../kitten-edit/kitten-edit.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { KittensService } from '../../services/kittens.service';
import { Observable, of, Subscribable } from 'rxjs';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterLink,
        MockComponent(NzButtonComponent),
        MockModule(NzIconModule),
        MockPipe(AsyncPipe, (() => ['2']) as unknown as {
          <T>(
            obj:
              | Observable<T>
              | Subscribable<T>
              | Promise<T>
              | null
              | undefined,
          ): T | null;
        }),
        FavoriteDirective,
        MockModule(NoopAnimationsModule),
      ],
      providers: [
        MockProvider(NzModalService),
        { provide: 'BASE_API_URL', useValue: 'api/' },
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProvider(ActivatedRoute),
        MockProvider(KittensService, {
          addKittenToFavorites: () => {},
          removeKittenFromFavorites: () => {},
        }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    component['kittens'] = kittensMock.map(
      (kitten) => new KittenModel(kitten) as KittenModel & { id: string },
    );
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onEditKitten having kittens', () => {
    const spy = jest
      .spyOn(component['modalService'], 'create')
      .mockImplementationOnce((() => {}) as unknown as () => NzModalRef<
        unknown,
        unknown
      >);
    const button = fixture.nativeElement.querySelector('[data-add="one"]');
    const buttonFirst =
      fixture.nativeElement.querySelector('[data-add="first"]');
    button.click();
    fixture.detectChanges();
    expect(buttonFirst).toBeFalsy();
    expect(spy).toHaveBeenCalledWith({
      nzTitle: 'Add new kitten',
      nzContent: KittenEditComponent,
      nzData: { kitten: undefined },
    });
  });

  it('should call addKittenToFavorites', () => {
    const spy = jest.spyOn(component['kittensService'], 'addKittenToFavorites');
    const button = fixture.nativeElement.querySelector(
      '[data-add-favorite="1"]',
    );
    const buttonAdd = fixture.nativeElement.querySelector(
      '[data-add-favorite="2"]',
    );
    button.click();
    fixture.detectChanges();
    expect(buttonAdd).toBeFalsy();
    expect(spy).toHaveBeenCalledWith('1');
  });

  it('should call removeKittenFromFavorites', () => {
    const spy = jest.spyOn(component['kittensService'], 'removeKittenFromFavorites');
    const button = fixture.nativeElement.querySelector(
      '[data-remove-favorite="2"]',
    );
    const buttonRemove = fixture.nativeElement.querySelector(
      '[data-remove-favorite="1"]',
    );
    button.click();
    fixture.detectChanges();
    expect(buttonRemove).toBeFalsy();
    expect(spy).toHaveBeenCalledWith('2');
  });
});

describe('HomeComponent without kittens', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterLink,
        MockComponent(NzButtonComponent),
        MockModule(NzIconModule),
        MockPipe(AsyncPipe, (() => []) as unknown as {
          <T>(
            obj:
              | Observable<T>
              | Subscribable<T>
              | Promise<T>
              | null
              | undefined,
          ): T | null;
        }),,
        FavoriteDirective,
        MockModule(NoopAnimationsModule),
      ],
      providers: [
        MockProvider(NzModalService),
        { provide: 'BASE_API_URL', useValue: 'api/' },
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProvider(ActivatedRoute),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    component['kittens'] = [];
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onEditKitten without kittens', () => {
    const spy = jest
      .spyOn(component['modalService'], 'create')
      .mockImplementationOnce((() => {}) as unknown as () => NzModalRef<
        unknown,
        unknown
      >);
    const button = fixture.nativeElement.querySelector('[data-add="one"]');
    const buttonFirst =
      fixture.nativeElement.querySelector('[data-add="first"]');
    buttonFirst.click();
    fixture.detectChanges();
    expect(button).toBeFalsy();
    expect(spy).toHaveBeenCalledWith({
      nzTitle: 'Add new kitten',
      nzContent: KittenEditComponent,
      nzData: { kitten: undefined },
    });
  });
});
