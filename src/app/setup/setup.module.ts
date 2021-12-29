import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SetupPage } from './setup.page';

import { SetupPageRoutingModule } from './setup-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SetupPageRoutingModule
  ],
  declarations: [SetupPage]
})
export class SetupPageModule {}
