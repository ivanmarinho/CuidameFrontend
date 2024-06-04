/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PETS_ROUTES } from './utils/routes/dash-rutas';
import { ContainerDashComponent } from './modules/container/dash/container-dash/container-dash.component';
import { InitialPage } from './pages/initial/initial.page';

const routes: Routes = [
  { path: 'private', component: ContainerDashComponent, children: PETS_ROUTES },

  {
    path: 'tabs',
    loadChildren: () =>
      import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'tab1',
    loadChildren: () =>
      import('./pages/tab1/tab1.module').then((m) => m.Tab1PageModule),
  },
  {
    path: 'tab2',
    loadChildren: () =>
      import('./pages/tab2/tab2.module').then((m) => m.Tab2PageModule),
  },
  {
    path: 'tab3',
    loadChildren: () =>
      import('./pages/tab3/tab3.module').then((m) => m.Tab3PageModule),
  },
  {
    path: 'initial',
    loadChildren: () =>
      import('./pages/initial/initial.module').then((m) => m.InitialPageModule),
  },
  {
    path: 'access',
    loadChildren: () =>
      import('./pages/indetification/access/access.module').then(
        (m) => m.AccessPageModule
      ),
  },
  {
    path: 'form1/:editFlag',
    loadChildren: () =>
      import('./pages/register/form1/form1.module').then(
        (m) => m.Form1PageModule
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'initial',
  },
  {
    path: 'authentication',
    loadChildren: () =>
      import(
        './pages/indetification/authentication/authentication.module'
      ).then((m) => m.AuthenticationPageModule),
  },
  {
    path: 'form2/:editFlag',
    loadChildren: () =>
      import('./pages/register/form2/form2.module').then(
        (m) => m.Form2PageModule
      ),
  },
  {
    path: 'form3/:editFlag',
    loadChildren: () =>
      import('./pages/register/form3/form3.module').then(
        (m) => m.Form3PageModule
      ),
  },
  {
    path: 'form',
    loadChildren: () =>
      import('./pages/register/form/form.module').then((m) => m.FormPageModule),
  },
  {
    path: 'form4/:editFlag',
    loadChildren: () =>
      import('./pages/register/form4/form4.module').then(
        (m) => m.Form4PageModule
      ),
  },
  {
    path: 'form5/:editFlag',
    loadChildren: () =>
      import('./pages/register/form5/form5.module').then(
        (m) => m.Form5PageModule
      ),
  },
  {
    path: 'maps',
    loadChildren: () =>
      import('./pages/maps/maps.module').then((m) => m.MapsPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'register-band',
    loadChildren: () =>
      import('./pages/register/register-band/register-band.module').then(
        (m) => m.RegisterBandPageModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'contacts',
    loadChildren: () =>
      import('./pages/register/contacts/contacts.module').then(
        (m) => m.ContactsPageModule
      ),
  },
  {
    path: 'qr-scanner',
    loadChildren: () =>
      import('./pages/qr-scanner/qr-scanner.module').then(
        (m) => m.QrScannerPageModule
      ),
  },
  {
    path: 'verification/:codeRequest',
    loadChildren: () =>
      import('./pages/indetification/verification/verification.module').then(
        (m) => m.VerificationPageModule
      ),
  },
  {
    path: 'help',
    loadChildren: () =>
      import('./pages/help/help/help.module').then((m) => m.HelpPageModule),
  },
  {
    path: 'borrar-cuenta',
    loadChildren: () =>
      import('./pages/help/borrar-cuenta/borrar-cuenta.module').then(
        (m) => m.BorrarCuentaPageModule
      ),
  },

  {
    path: 'resetpassword',
    loadChildren: () =>
      import('./pages/register/reset-pass/reset-pass.module').then(
        (m) => m.ResetPassModule
      ),
  },

  {
    path: 'newpassword/:id/:resetToken',
    loadChildren: () =>
      import('./pages/indetification/new-password/new-password.module').then(
        (m) => m.NewPasswordModule
      ),
  },

  {
    path: 'confirmed',
    loadChildren: () =>
      import('./pages/register/confirmed/confirmed.module').then(
        (m) => m.ConfirmedModule
      ),
  },
  {
    path: 'contactus',
    loadChildren: () =>
      import('./pages/help/contactus/contactus.module').then(
        (m) => m.ContactusModule
      ),
  },

  {
    path: 'prueba',
    loadChildren: () =>
      import('./pages/help/prueba/prueba.module').then(
        (m) => m.PruebaModule
      ),
  },

  {
    path: 'identify',
    loadChildren: () =>
      import('./pages/indetification/identify/identify.module').then(
        (m) => m.IdentifyPageModule
      ),
  },
  {
    path: 'logged',
    loadChildren: () =>
      import('./pages/logged/logged.module').then((m) => m.LoggedPageModule),
  },
  {
    path: 'objetos-mascotas',
    loadChildren: () =>
      import('./pages/register/objetos-mascotas/objetos-mascotas.module').then(
        (m) => m.ObjetosMascotasPageModule
      ),
  },
  {
    path: 'register-object',
    loadChildren: () =>
      import('./pages/register/register-object/register-object.module').then(
        (m) => m.RegisterObjectPageModule
      ),
  },
  {
    path: 'check',
    loadChildren: () =>
      import('./pages/register/check/check.module').then(
        (m) => m.CheckPageModule
      ),
  },
  {
    path: 'mascotas',
    loadChildren: () =>
      import('./pages/register/mascotas/mascotas.module').then(
        (m) => m.MascotasPageModule
      ),
  },
  {
    path: 'pet-tabs',
    loadChildren: () =>
      import('./components/pet-tabs/pet-tabs.module').then(
        (m) => m.PetTabsPageModule
      ),
  },

  {
    path: 'petcode',
    loadChildren: () => import('./pages/indetification/petcode/petcode.module').then( m => m.PetcodePageModule)
  },
  {
    path: 'updateuser',
    loadChildren: () => import('./pages/user-account/update-user/update-user.module').then( m => m.UpdateUserPageModule)
  },







];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
