import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoCardComponent } from './components/info-card/info-card.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './components/modal/modal.component';
import { LoaderComponent } from './components/loader/loader.component';
import { IMaskModule } from 'angular-imask';
@NgModule({
  declarations: [InfoCardComponent, ModalComponent, LoaderComponent],

  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    IMaskModule,
  ],

  exports: [InfoCardComponent, LoaderComponent, ModalComponent],
})
export class SharedModule {}
