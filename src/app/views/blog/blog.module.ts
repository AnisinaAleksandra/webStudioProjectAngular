import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogListComponent } from './blog-list/blog-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActicleComponent } from './acticle/acticle.component';
import { FiltersComponent } from './components/filters/filters.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HotToastModule } from '@ngneat/hot-toast';


@NgModule({
  declarations: [
    BlogListComponent,
    ActicleComponent,
    FiltersComponent,
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    HotToastModule.forRoot(),
    FormsModule,
  ]
})
export class BlogModule { }
