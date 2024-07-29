import { Routes } from '@angular/router';
import {
  kittensResolver,
  kittenDetailsResolver,
} from '../resolvers/kittens.resolver';

export const routes: Routes = [
  {
    path: 'kittens',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./../views/home/home.component').then((m) => m.HomeComponent),
        resolve: { kittens: kittensResolver },
        runGuardsAndResolvers: "always",
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./../views/kitten/kitten.component').then(
            (m) => m.KittenComponent,
          ),
        resolve: { kitten: kittenDetailsResolver },
        runGuardsAndResolvers: "always"
      },
    ],
  },
  {
    path: '',
    redirectTo: 'kittens',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'kittens',
    pathMatch: 'full',
  },
];
