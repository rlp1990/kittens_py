import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Inject,
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
import {
  NzUploadComponent,
  NzUploadFile,
  NzUploadXHRArgs,
} from 'ng-zorro-antd/upload';
import { Subscription } from 'rxjs';
import {
  HttpClient,
  HttpEvent,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-kitten-edit',
  standalone: true,
  imports: [
    FormsModule,
    NzInputDirective,
    ReactiveFormsModule,
    NzUploadComponent,
    NzIconModule,
  ],
  templateUrl: './kitten-edit.component.html',
  styleUrls: ['./kitten-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KittenEditComponent implements OnInit {
  private kittensService = inject(KittensService);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private modalRef = inject(NzModalRef);
  private destroyRef = inject(DestroyRef);

  constructor(@Inject('BASE_API_URL') private baseUrl: string) {}

  private data: { kitten?: KittenModel } = inject(NZ_MODAL_DATA);
  protected form: FormGroup = this.fb.group({
    id: new FormControl(this.data?.kitten?.id),
    name: new FormControl(this.data?.kitten?.name, Validators.required),
    age: new FormControl(this.data?.kitten?.age, Validators.required),
    breed: new FormControl(this.data?.kitten?.breed, Validators.required),
    image_url: new FormControl(
      this.data?.kitten?.image_url,
      Validators.required,
    ),
    vaccinations: new FormControl(this.data?.kitten?.vaccinations ?? []),
    file: new FormControl(
      this.data?.kitten?.image_url
        ? [
            {
              uid: '1',
              name: `${this.data?.kitten?.name}.jpg`,
              status: 'done',
              url: this.data?.kitten?.image_url,
              thumbUrl: this.data?.kitten?.image_url,
            },
          ]
        : null,
    ),
  });
  protected isAlreadyMakingRequest: boolean = false;

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
    this.modalRef.updateConfig({
      nzOnOk: () => {
        const { file, ...kitten } = this.form.value as KittenModel & {
          file?: NzUploadFile[];
        };
        this.kittensService.upsertKitten(kitten);
      },
      nzOkDisabled: !this.form.valid || this.isAlreadyMakingRequest,
    });
  }

  protected upload = (item: NzUploadXHRArgs): Subscription => {
    this.isAlreadyMakingRequest = true;
    const formData = new FormData();
    formData.append('file', item.file as any);
    const req = new HttpRequest(
      'POST',
      `${this.baseUrl}/upload_image/`,
      formData,
      {
        reportProgress: true,
        withCredentials: false,
      },
    );
    return this.http.request(req).subscribe({
      next: (event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse && item.onSuccess) {
          const { image_url } = event.body as { image_url: string };
          this.form.get('image_url')?.setValue(image_url);
          this.isAlreadyMakingRequest = false;
          item.onSuccess(event.body, item.file, event);
        }
      },
      error: (err) => {
        this.isAlreadyMakingRequest = false;
        if (item.onError) item.onError(err, item.file);
      },
    });
  };

  protected setMediaUploadHeaders = (file: NzUploadFile) => {
    return {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    };
  };

  protected handleChange(event: {
    file: NzUploadFile;
    fileList: NzUploadFile[];
  }): void {
    const { file } = event;

    if (file.status === 'done') {
      if (event.fileList.length > 1) {
        const [, newFile] = event.fileList;
        this.form.get('file')?.setValue([newFile]);
      } else {
        this.form.get('file')?.setValue(event.fileList);
      }
    }
  }
}
