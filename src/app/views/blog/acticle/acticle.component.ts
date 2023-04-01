import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ArticlesService } from 'src/app/services/articles.service';
import { CommentsService } from 'src/app/services/comments.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ArticleDetailsType, ArticleType } from 'src/types/article.type';
import { AllCommentsType, CommentType } from 'src/types/comments.type';
import { DefaultResponseType } from 'src/types/defaultReasponse.type';

@Component({
  selector: 'app-acticle',
  templateUrl: './acticle.component.html',
  styleUrls: ['./acticle.component.scss'],
})
export class ActicleComponent implements OnInit, AfterViewInit {
  commentForm = this.fb.group({
    comment: ['', [Validators.required]],
  });
  isLogged: boolean = false;
  articleDetails: ArticleDetailsType | null = null;
  relatedArticles: ArticleType[] | null = null;
  commentsCount: number = 0;
  loading: boolean = false;
  showBtnLoad: boolean = true;
  comments:
    | AllCommentsType
    | {
        allCount: 0;
        comments: [];
      } = {
    allCount: 0,
    comments: [],
  };

  detailText: any;

  commentsList: CommentType[] = [];
  userApplyComments: {
    comment: string;
    action: string;
  }[] = [];
  constructor(
    private fb: FormBuilder,
    private articleService: ArticlesService,
    private activatedRoute: ActivatedRoute,
    private commentsService: CommentsService,
    private loadingService: LoaderService,
    private toast: HotToastService
  ) {
    this.isLogged = !!localStorage.getItem('accessToken');
    this.articleDetails = {
      comments: [],
      commentsCount: 0,
      id: '',
      title: '',
      description: '',
      image: '',
      date: '',
      category: '',
      url: '',
    };
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.articleService
        .getArticle(params['url'])
        .subscribe((data: ArticleDetailsType) => {
          if (data) {
            this.articleDetails = data;
            this.commentsCount = data.commentsCount;
            this.detailText = data.text;
            this.commentsList = data.comments;
            console.log(this.commentsList);

            this.loadCommentsCount(false);
            this.getAllApplyActionsArticleComments(data.id);
          }
        });

      this.articleService
        .getRelatedArticle(params['url'])
        .subscribe((dataArticles: ArticleType[]) => {
          if (dataArticles) {
            this.relatedArticles = dataArticles;
          }
        });
    });
  }

  ngAfterViewInit():void {
    if (this.articleDetails!.commentsCount > this.commentsList.length) {
      this.showBtnLoad = true;
    } else if (
      this.articleDetails!.commentsCount === this.commentsList.length
    ) {
      this.showBtnLoad = false;
    }
  }

  getAllApplyActionsArticleComments(articleId: string) {
    this.commentsService
      .getAllApplyActionsArticleComments({ articleId: articleId })
      .subscribe(
        (
          dataApplyComments:
            | DefaultResponseType
            | {
                comment: string;
                action: string;
              }[]
        ) => {
          if (
            dataApplyComments as {
              comment: string;
              action: string;
            }[]
          ) {
            this.userApplyComments = dataApplyComments as {
              comment: string;
              action: string;
            }[];
            if (this.userApplyComments.length && this.commentsList.length) {
              this.commentsList.forEach((item: CommentType) => {
                let isCommentApply = this.userApplyComments.find(
                  (el) => el.comment === item.id
                );
                if (!!isCommentApply) {
                  return (item.usersAction = isCommentApply.action);
                } else return item;
              });
            }
          }
        }
      );
  }
  sendingComment() {
    let newComment = {
      id: this.articleDetails!.id,
      text: this.commentForm!.value!.comment || '',
      date: `${new Date()}`,
      likesCount: 0,
      dislikesCount: 0,
      user: {
        id: localStorage.getItem('userId') || '',
        name: localStorage.getItem('name') || '',
      },
    };
    this.commentsService
      .sendComment(this.commentForm!.value!.comment, this.articleDetails!.id)
      .subscribe((data) => {
        if (data.error === false) {
          this.loadCommentsCount(false);
          this.toast.success(data.message);
          this.commentForm.reset();
        }
        console.log(this.commentsList);
      });
  }
  loadCommentsCount(isBtn: boolean) {
    if (isBtn) {
      this.showBtnLoad = false;
      this.loadingService.setLoading(true);
    }
    let count = isBtn ? 10 : 3;
    this.commentsService
      .getComments({ offset: count, article: this.articleDetails!.id })
      .subscribe((comments: AllCommentsType) => {
        this.commentsList = comments.comments;
        this.loadingService.setLoading(false);
        this.getAllApplyActionsArticleComments(this.articleDetails!.id);
        if (this.articleDetails!.commentsCount > this.commentsList.length) {
          this.showBtnLoad = true;
        } else if (
          this.articleDetails!.commentsCount === this.commentsList.length
        ) {
          this.showBtnLoad = false;
        }
      });
  }

  applyAction(id: string, action: string):void {
    this.commentsService.applyAction(id, action).subscribe((data) => {
      if (data.error === true) {
        this.toast.error('Необходимо войти в систему');
      }
      if (action === 'like' || action === 'dislike') {
        this.toast.success('Ваш голос учтен.');
        this.commentsList.forEach((el) => {
          if (el.id === id) {
            if (action === 'like' && el.usersAction !== 'like') {
              el.likesCount++;
              el.usersAction = 'like';
              if (el.dislikesCount !== 0) {
                el.dislikesCount--;
              }
            }
            if (action === 'dislike' && el.usersAction !== 'dislike') {
              el.dislikesCount++;
              el.usersAction = 'dislike';
              if (el.likesCount !== 0) {
                el.likesCount--;
              }
            }
          }
        });

        this.userApplyComments.push({ comment: id, action: action });
      }
      if (action === 'violate') {
        if (data.error === false) {
          this.toast.success('Жалоба отправлена');
        } else if (data.error === true) {
          this.toast.error('Жалоба уже отправлена.');
        }
      }
    });
  }
}
