import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'scan',
        loadChildren: () => import('../scan/scan.module').then(m => m.ScanPageModule)
      },
      {
        path: 'setup',
        loadChildren: () => import('../setup/setup.module').then(m => m.SetupPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/scan',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/scan',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
