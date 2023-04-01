import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActiveParamsType } from 'src/types/active-params.type';
import { ArticleDetailsType, ArticleType } from 'src/types/article.type';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  constructor(private http: HttpClient) {}
  getBestArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top');
  }


  getArticles(params: ActiveParamsType): Observable<{
    totalCount: number;
    pages: number;
    items: ArticleType[];
  }> {
    return this.http.get<{
      totalCount: number;
      pages: number;
      items: ArticleType[];
    }>(environment.api + 'articles', {params:params});
  }
  getArticle(url:string): Observable<ArticleDetailsType> {
    return this.http.get<ArticleDetailsType>(environment.api + 'articles/' + url);
  }

  getRelatedArticle(url:string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/related/' + url);
  }
}
