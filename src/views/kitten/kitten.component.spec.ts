import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KittenComponent } from './kitten.component';
import { kittensMock } from '../../mocks/kittens.mock';
import { Kitten, KittenModel } from '../../models/kittens.model';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableComponent, NzTableModule } from 'ng-zorro-antd/table';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MockPipe, MockProvider } from 'ng-mocks';
import { Observable, Subscribable } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { KittenEditComponent } from '../kitten-edit/kitten-edit.component';
import { modalRefConfirmMock } from '../../mocks/modal-ref.mock';
import { VaccinationEditComponent } from '../vaccination-edit/vaccination-edit.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('KittenComponent', () => {
  let fixture: ComponentFixture<KittenComponent>;
  let component: KittenComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        KittenComponent,
        NzIconModule,
        NzTableModule,
        MockPipe(DatePipe),
        MockPipe(AsyncPipe, (() => ['1']) as unknown as {
          <T>(
            obj:
              | Observable<T>
              | Subscribable<T>
              | Promise<T>
              | null
              | undefined,
          ): T | null;
        }),
        NoopAnimationsModule,
      ],
      providers: [
        { provide: 'BASE_API_URL', useValue: 'api' },
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProvider(NzModalService),
        MockProvider(NzModalRef),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(KittenComponent);
    component = fixture.componentInstance;
    component['kitten'] = new KittenModel(
      kittensMock[0] as unknown as Kitten,
    ) as KittenModel & { id: string };
    component['vaccinationsTable'] = TestBed.createComponent(
      NzTableComponent<KittenModel>,
    ).componentInstance;
    component['vaccinationsTable'].data = component[
      'kitten'
    ] as unknown as readonly KittenModel[];
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call create edit modal', () => {
    const spy = jest
      .spyOn(component['modalService'], 'create')
      .mockImplementationOnce((() => {}) as unknown as () => NzModalRef<
        unknown,
        unknown
      >);
    const button = fixture.nativeElement.querySelector('[data-edit="1"]');
    button.click();
    expect(spy).toHaveBeenCalledWith({
      nzTitle: 'Edit kitten',
      nzContent: KittenEditComponent,
      nzData: { kitten: component['kitten'] },
    });
  });

  it('should call deleteKitten', () => {
    const spy = jest
      .spyOn(component['kittensService'], 'deleteKitten')
      .mockImplementationOnce((() => {}) as unknown as () => void);
    const spyModal = jest
      .spyOn(component['modalService'], 'confirm')
      .mockImplementationOnce(modalRefConfirmMock);
    const button = fixture.nativeElement.querySelector('[data-delete="1"]');
    button.click();
    expect(spyModal).toHaveBeenCalled();
    component['modalRef'].triggerOk();
    expect(spy).toHaveBeenCalledWith('1');
  });

  it('should call create for vaccination modal', () => {
    const spy = jest
      .spyOn(component['modalService'], 'create')
      .mockImplementationOnce(modalRefConfirmMock);
    const button = fixture.nativeElement.querySelector(
      '[data-edit-vaccination="1"]',
    );
    button.click();
    expect(spy).toHaveBeenCalledWith({
      nzTitle: 'Vaccination',
      nzContent: VaccinationEditComponent,
      nzData: { kitten: component['kitten'], vaccinationIndex: 0 },
    });
  });

  it('should call upsertKitten to delete vaccination', () => {
    const spyConfirm = jest
      .spyOn(component['modalService'], 'confirm')
      .mockImplementationOnce(modalRefConfirmMock);
    const spy = jest.spyOn(component['kittensService'], 'upsertKitten');
    const button = fixture.nativeElement.querySelector(
      '[data-delete-vaccination="1"]',
    );
    button.click();
    expect(spyConfirm).toHaveBeenCalled();
    component['modalRef'].triggerOk();
    const kitten = new KittenModel(
      kittensMock[0] as unknown as Kitten,
    ) as KittenModel & { id: string };
    kitten.vaccinations = [];
    kitten.image_url = 'img_url';
    expect(spy).toHaveBeenCalledWith(kitten);
  });

  it('should call onRemoveFavoriteClick', () => {
    const spy = jest.spyOn(component, 'onRemoveFavoriteClick' as any);
    const button = fixture.nativeElement.querySelector(
      '[data-remove-favorite="1"]',
    )
    button.click();
    expect(spy).toHaveBeenCalled();
  });
});


describe('KittenComponent without favorite', () => {
  let fixture: ComponentFixture<KittenComponent>;
  let component: KittenComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        KittenComponent,
        NzIconModule,
        NzTableModule,
        MockPipe(DatePipe),
        MockPipe(AsyncPipe, (() => []) as unknown as {
          <T>(
            obj:
              | Observable<T>
              | Subscribable<T>
              | Promise<T>
              | null
              | undefined,
          ): T | null;
        }),
        NoopAnimationsModule,
      ],
      providers: [
        { provide: 'BASE_API_URL', useValue: 'api' },
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProvider(NzModalService),
        MockProvider(NzModalRef),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(KittenComponent);
    component = fixture.componentInstance;
    component['kitten'] = new KittenModel(
      kittensMock[0] as unknown as Kitten,
    ) as KittenModel & { id: string };
    component['vaccinationsTable'] = TestBed.createComponent(
      NzTableComponent<KittenModel>,
    ).componentInstance;
    component['vaccinationsTable'].data = component[
      'kitten'
    ] as unknown as readonly KittenModel[];
    fixture.detectChanges();
  });

  it('should call onAddFavoriteClick', () => {
    const spy = jest.spyOn(component, 'onAddFavoriteClick' as any);
    const button = fixture.nativeElement.querySelector(
      '[data-add-favorite="1"]',
    )
    button.click();
    expect(spy).toHaveBeenCalled();
  });
});
