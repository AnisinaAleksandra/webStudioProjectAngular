import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ArticlesService } from 'src/app/services/articles.service';
import { ActiveParamsUtil } from 'src/app/utils/active-params.util';
import { ActiveParamsType } from 'src/types/active-params.type';
import { ArticleType } from 'src/types/article.type';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  listOfArticles: ArticleType[] | null = null;
  activeParams: ActiveParamsType = { categories: [] };
  pages: number[] = [];
constructor(private articlesService: ArticlesService,  private router: Router,  private activatedRoute: ActivatedRoute){

}
  ngOnInit(): void {
    this.articlesService.getArticles(this.activeParams).subscribe((data: {
      totalCount: number;
      pages: number;
      items: ArticleType[];
    }) => {
      this.pages = [];
      for (let i = 1; i <= data.pages; i++) {
        this.pages.push(i);
      }      
      this.listOfArticles = data.items;

      this.activatedRoute.queryParams
      .pipe(debounceTime(500))
      .subscribe((params) => {
        this.activeParams = ActiveParamsUtil.processParams(params);

        
     
        this.articlesService.getArticles(this.activeParams).subscribe((data) => {
          this.pages = [];
          for (let i = 1; i <= data.pages; i++) {
            this.pages.push(i);
          }
          this.listOfArticles = data.items;
        });
      });
    });
  }

  openPage(page: number):void{
    this.activeParams.page = page;
    this.router.navigate(['/blog-list'], {
      queryParams: this.activeParams,
    });
  }
  openPrevPage():void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog-list'], {
        queryParams: this.activeParams,
      });
    }
  }
  openNextPage():void {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/blog-list'], {
        queryParams: this.activeParams,
      });
    }
  }
}
