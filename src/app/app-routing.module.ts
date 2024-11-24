import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './modules/shared/services/auth.guard';

const routes: Routes = [
  {
    path: 'chat',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../app/modules/chat/chat.module').then((m) => m.ChatModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('../app/modules/auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
