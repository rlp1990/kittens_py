import { ResolveFn } from '@angular/router';
import { KittenModel } from '../models/kittens.model';
import { inject } from '@angular/core';
import { KittensService } from '../services/kittens.service';

export const kittensResolver: ResolveFn<KittenModel[]> = (route, state) =>
  inject(KittensService).getAll();

export const kittenDetailsResolver: ResolveFn<KittenModel> = (route, state) =>
  inject(KittensService).getKittenById(route.paramMap.get('id')!);
