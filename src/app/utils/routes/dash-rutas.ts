import { Routes } from '@angular/router';

export const PETS_ROUTES: Routes = [

  // Pets Routes
  {
    path: 'pets',
    loadChildren: () =>
      import('src/app/pages/pets/basic-info/pets.module').then((m) => m.PetsModule),
  },

  {
    path: 'pages',
    loadChildren: () =>
      import('src/app/pages/pets/pets-pages/pets-pages.module').then((m) => m.PetsPagesModule),
  },

  // Hsitory Routes
  {
    path: 'history',
    loadChildren: () =>
      import('src/app/pages/pets/history/history.module').then((m) => m.HistoryModule),
  },
  //Vaccine Routes
  {
    path: 'vaccine',
    loadChildren: () =>
      import('src/app/pages/pets/vaccine-info/pets-vaccine.module').then((m) => m.PetsVaccineModule),
  },
  // Disease Routes
  {
    path: 'disease',
    loadChildren: () =>
      import('src/app/pages/pets/disease/disease.module').then((m) => m.DiseaseModule),
  },

  //Treatment

  {
    path: 'treatment',
    loadChildren: () =>
      import('src/app/pages/pets/treatment/treatment.module').then((m) => m.TreatmentModule),
  },
  // Veterinarian Routes

  {
    path: 'veterinarian',
    loadChildren: () =>
      import('src/app/pages/pets/veterinarian/veterinarian.module').then((m) => m.VeterinarianModule),
  },



  { path: '', redirectTo: 'initial', pathMatch: 'full' },
];
