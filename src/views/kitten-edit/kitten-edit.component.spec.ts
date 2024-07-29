import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KittenEditComponent } from './kitten-edit.component';
import { RouterLink } from '@angular/router';
import { kittensMock } from '../../mocks/kittens.mock';
import { KittenModel } from '../../models/kittens.model';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { MockProvider } from 'ng-mocks';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('KittenEditComponent', () => {
  let fixture: ComponentFixture<KittenEditComponent>;
  let component: KittenEditComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KittenEditComponent, RouterLink, NoopAnimationsModule],
      providers: [
        {
          provide: NZ_MODAL_DATA,
          useValue: { kitten: new KittenModel(kittensMock[0]) },
        },
        MockProvider(NzModalRef, {
          updateConfig: () => {},
        }),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: 'BASE_API_URL', useValue: 'api' },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(KittenEditComponent);
    component = fixture.componentInstance;
    component['data'] = TestBed.inject(NZ_MODAL_DATA);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
