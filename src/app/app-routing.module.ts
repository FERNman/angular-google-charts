import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestComponent } from './test/test.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: 'app', component: MainComponent },
  { path: 'test', component: TestComponent },
  { path: '', redirectTo: '/app', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
