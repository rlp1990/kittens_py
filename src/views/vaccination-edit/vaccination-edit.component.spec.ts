import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VaccinationEditComponent } from './vaccination-edit.component';
import { RouterLink } from '@angular/router';
import { kittensMock } from '../../mocks/kittens.mock';
import { KittenModel } from '../../models/kittens.model';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { MockProvider } from 'ng-mocks';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('VaccinationEditComponent', () => {
  let fixture: ComponentFixture<VaccinationEditComponent>;
  let component: VaccinationEditComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaccinationEditComponent, RouterLink],
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
        {provide: 'BASE_API_URL', useValue: 'api'},
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(VaccinationEditComponent);
    component = fixture.componentInstance;
    component['data'] = TestBed.inject(NZ_MODAL_DATA);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
