import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { KittenModel } from '../../models/kittens.model';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { KittenEditComponent } from '../kitten-edit/kitten-edit.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NzTableComponent, NzTableModule } from 'ng-zorro-antd/table';
import { AsyncPipe, DatePipe } from '@angular/common';
import { VaccinationEditComponent } from '../vaccination-edit/vaccination-edit.component';
import { FavoriteDirective } from '../../directives/favourite.directive';

@Component({
  selector: 'app-kitten',
  standalone: true,
  providers: [NzModalService, provideAnimations()],
  imports: [
    KittenEditComponent,
    NzIconModule,
    NzTableModule,
    DatePipe,
    AsyncPipe,
  ],
  templateUrl: './kitten.component.html',
  styleUrls: ['./kitten.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KittenComponent extends FavoriteDirective {
  @Input() kitten!: KittenModel & { id: string };

  private modalService = inject(NzModalService);
  private modalRef = inject(NzModalRef);

  @ViewChild('vaccinationsTable')
  protected vaccinationsTable!: NzTableComponent<KittenModel>;

  protected openEditModal(kitten: KittenModel): void {
    this.modalService.create({
      nzTitle: 'Edit kitten',
      nzContent: KittenEditComponent,
      nzData: { kitten },
    });
  }

  protected onDeleteKitten(id: string): void {
    this.modalRef = this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this kitten?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.kittensService.deleteKitten(id);
      },
      nzCancelText: 'No',
    });
  }

  protected onOpenVaccinationModal(
    kitten: KittenModel,
    vaccinationIndex?: number,
  ): void {
    this.modalService.create({
      nzTitle: 'Vaccination',
      nzContent: VaccinationEditComponent,
      nzData: { kitten, vaccinationIndex },
    });
  }

  protected onDeleteVaccination(
    kitten: KittenModel,
    vaccinationIndex: number,
  ): void {
    this.modalRef = this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this vaccination?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        kitten.vaccinations.splice(vaccinationIndex, 1);
        this.kittensService.upsertKitten(kitten);
      },
      nzCancelText: 'No',
    });
  }
}
