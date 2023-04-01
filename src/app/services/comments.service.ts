import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  AllCommentsType,
  CommentsAddType,
  CommetnsParamsType,
} from 'src/types/comments.type';
import { DefaultResponseType } from 'src/types/defaultReasponse.type';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(private http: HttpClient) {}

  getComments(params: CommetnsParamsType): Observable<AllCommentsType> {
    return this.http.get<AllCommentsType>(environment.api + 'comments', {
      params: params,
    });
  }
  sendComment(
    text: string | any,
    article: string
  ): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text,
      article,
    });
  }

  applyAction(id: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(
      environment.api + 'comments/' + id + '/apply-action',
      {
        action,
      }
    );
  }

  getAllApplyActionsArticleComments(params:{articleId: string}): Observable<
    | DefaultResponseType
    | {
        comment: string;
        action: string;
      }[]
  > {
    return this.http.get<
      | DefaultResponseType
      | {
          comment: string;
          action: string;
        }[]
    >(environment.api + 'comments/article-comment-actions', {
      params: params,
    });
  }
}
