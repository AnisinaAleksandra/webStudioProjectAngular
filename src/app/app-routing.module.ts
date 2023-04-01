import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { MainComponent } from './views/main/main.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: MainComponent },
        // { path: 'articles/:url', component: BlogComponent },
      {
        path: '',
        loadChildren: () =>
          import('./views/user/user.module').then((m) => m.UserModule),
        // canActivate: [AuthForwardGuard],
      },
      {
        path: '',
        loadChildren: () =>
          import('./views/blog/blog.module').then((m) => m.BlogModule),
      },
    //   {
    //     path: '',
    //     loadChildren: () =>
    //       import('./views/order/order.module').then((m) => m.OrderModule),
    //   },
    //   {
    //     path: '',
    //     loadChildren: () =>
    //       import('./views/personal/personal.module').then(
    //         (m) => m.PersonalModule
    //       ),
    //     canActivate: [AuthGuard],
    //   },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
