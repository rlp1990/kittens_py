import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { KittenModel } from '../../models/kittens.model';
import { RouterLink } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { KittenEditComponent } from '../kitten-edit/kitten-edit.component';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AsyncPipe } from '@angular/common';
import { FavoriteDirective } from '../../directives/favourite.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    NzButtonComponent,
    NzIconModule,
    AsyncPipe,
    FavoriteDirective,
  ],
  providers: [NzModalService, provideAnimations()],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends FavoriteDirective {
  @Input() protected kittens!: (KittenModel & { id: string })[];

  private modalService = inject(NzModalService);

  protected onEditKitten() {
    this.modalService.create({
      nzTitle: 'Add new kitten',
      nzContent: KittenEditComponent,
      nzData: { kitten: undefined },
    });
  }
}
