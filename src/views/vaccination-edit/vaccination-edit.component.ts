import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { KittenModel } from '../../models/kittens.model';
import { KittensService } from '../../services/kittens.service';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-vaccination-edit',
  standalone: true,
  imports: [
    FormsModule,
    NzInputDirective,
    ReactiveFormsModule,
    NzIconModule,
    NzDatePickerModule,
  ],
  templateUrl: './vaccination-edit.component.html',
  styleUrls: ['./vaccination-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VaccinationEditComponent implements OnInit {
  private kittensService = inject(KittensService);
  private fb = inject(FormBuilder);
  private modalRef = inject(NzModalRef);
  private destroyRef = inject(DestroyRef);

  private data: { kitten: KittenModel; vaccinationIndex?: number } =
    inject(NZ_MODAL_DATA);

  protected form: FormGroup = this.fb.group({
    id: new FormControl(this.data?.kitten?.id),
    type: new FormControl(
      this.data?.vaccinationIndex || this.data?.vaccinationIndex === 0
        ? this.data?.kitten?.vaccinations?.[this.data.vaccinationIndex]?.type
        : null,
      Validators.required,
    ),
    date: new FormControl(
      this.data?.vaccinationIndex || this.data?.vaccinationIndex === 0
        ? new Date(
            this.data?.kitten?.vaccinations?.[this.data.vaccinationIndex]?.date,
          )
        : null,
      Validators.required,
    ),
  });

  ngOnInit(): void {
    this.subscribeToFormChanges();
    this.updateModalConfig();
  }

  private subscribeToFormChanges(): void {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateModalConfig();
      });
  }

  private updateModalConfig(): void {
    if (!this.form.valid) {
      this.modalRef.updateConfig({
        nzOkDisabled: !this.form.valid,
      });
      return;
    }
    const { type, date } = this.form.value;
    const vaccinations = [...this.data.kitten.vaccinations];
    if (!this.data.vaccinationIndex && this.data.vaccinationIndex !== 0) {
      vaccinations.push({ type, date });
    } else {
      vaccinations[this.data.vaccinationIndex] = { type, date };
    }
    this.modalRef.updateConfig({
      nzOnOk: () => {
        this.kittensService.upsertKitten({
          ...this.data.kitten,
          vaccinations,
        });
      },
      nzOkDisabled: !this.form.valid,
    });
  }
}
