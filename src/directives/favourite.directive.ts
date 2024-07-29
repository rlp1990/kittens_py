import { Directive, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { KittensService } from '../services/kittens.service';
import { KittenModel } from '../models/kittens.model';

@Directive({
  selector: '[appFavorite]',
  standalone: true,
})
export class FavoriteDirective implements OnInit {
  protected kittensService = inject(KittensService);

  protected favoriteKittenIds$!: Observable<string[]>;

  ngOnInit(): void {
    this.favoriteKittenIds$ = this.kittensService.favoriteKittenIds$;
  }

  protected onAddFavoriteClick(
    event: MouseEvent | KeyboardEvent,
    kitten: KittenModel,
  ) {
    event.preventDefault();
    event.stopPropagation();
    this.kittensService.addKittenToFavorites(kitten.id as string);
  }

  protected onRemoveFavoriteClick(
    event: MouseEvent | KeyboardEvent,
    kitten: KittenModel,
  ) {
    event.preventDefault();
    event.stopPropagation();
    this.kittensService.removeKittenFromFavorites(kitten.id as string);
  }
}
