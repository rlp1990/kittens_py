import { Inject, inject, Injectable } from '@angular/core';
import { Kitten, KittenModel } from '../models/kittens.model';
import { BehaviorSubject, first, map, Observable } from 'rxjs';
import { kittensMock } from '../mocks/kittens.mock';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class KittensService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private messageService = inject(NzMessageService);

  private favoriteKittenIds: string[] = [];
  private _favoriteKittenIds$ = new BehaviorSubject<string[]>(
    this.favoriteKittenIds,
  );

  get favoriteKittenIds$(): Observable<string[]> {
    return this._favoriteKittenIds$.asObservable();
  }

  constructor(@Inject('BASE_API_URL') private baseUrl: string) {}

  getAll(): Observable<KittenModel[]> {
    return this.http
      .get<Kitten[]>(`${this.baseUrl}/kittens`)
      .pipe(map((kittens) => kittens.map((kitten) => new KittenModel(kitten))));
  }

  getKittenById(id: string): Observable<KittenModel> {
    return this.http
      .get<Kitten>(`${this.baseUrl}/kittens/${id}`)
      .pipe(map((kitten) => new KittenModel(kitten)));
  }

  upsertKitten(kitten: Partial<KittenModel>): void {
    const { image_url } = kitten;
    kitten.image_url = image_url?.includes('images/')
      ? image_url?.replace('images/', '')
      : image_url;
    if (!kitten.id) {
      this.addKitten(kitten);
      return;
    }
    this.updateKitten(kitten);
  }

  private addKitten(kitten: Partial<KittenModel>): void {
    this.http
      .post(`${this.baseUrl}/kittens/`, kitten)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['./']);
        },
        error: (error: Error) => {
          this.messageService.error(error.message);
        },
      });
  }

  private updateKitten(kitten: Partial<KittenModel>): void {
    this.http
      .put(`${this.baseUrl}/kittens/${kitten.id}`, kitten)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate([`/kittens/${kitten.id}`]);
        },
        error: (error: Error) => {
          this.messageService.error(error.message);
        },
      });
  }

  deleteKitten(id: string): void {
    this.http
      .delete(`${this.baseUrl}/kittens/${id}`)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['./']);
        },
        error: (error: Error) => {
          this.messageService.error(error.message);
        },
      });
  }

  addKittenToFavorites(id: string): void {
    this.favoriteKittenIds.push(id);
    this._favoriteKittenIds$.next(this.favoriteKittenIds);
  }

  removeKittenFromFavorites(id: string): void {
    this.favoriteKittenIds = this.favoriteKittenIds.filter(
      (kittenId) => kittenId !== id,
    );
    this._favoriteKittenIds$.next(this.favoriteKittenIds);
  }
}
