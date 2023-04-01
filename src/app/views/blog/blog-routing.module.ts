import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogListComponent } from './blog-list/blog-list.component';
import { ActicleComponent } from './acticle/acticle.component';

const routes: Routes = [
  { path: 'blog-list', component: BlogListComponent },
  { path: 'articles/:url', component: ActicleComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
