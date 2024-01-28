import {Component, OnDestroy, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleItemType} from "../../../../types/article-item.type";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {ArticleType} from "../../../../types/article.type";
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentService} from "../../../shared/services/comment.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {GetCommentsType} from "../../../../types/get-comments.type";
import {ActionsService} from "../../../shared/services/actions.service";
import {ActionUserArticleType} from "../../../../types/action-user-article.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {UnsubscribeService} from "../../../core/unsubscribe/unsubscribe.service";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, OnDestroy {

  public article: ArticleItemType | null = null;
  public commentaries!: GetCommentsType;
  public relatedArticles: ArticleType[] | null = [];
  public serverStaticPath = environment.serverStaticPass;
  public formComment = this.fb.group({
      comment: ['', [Validators.required]]
  })
  public isLoggedIn: boolean = false;
  public actionsUser: ActionUserArticleType[] = [];
  public loader: boolean = false;
  private userId: string | null = null;

  constructor(private articleService: ArticleService,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private authService: AuthService,
              private commentService: CommentService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private actionsService: ActionsService,
              private unsubscribeService: UnsubscribeService) {
    this.isLoggedIn = this.authService.getIsLoggedIn();
    this.userId = this.authService.userId;
  }

  public ngOnInit(): void {

    this.unsubscribeService.sub = this.activatedRoute.params
      .subscribe(params => {

        this.articleService.getArticle(params['url'])
          .subscribe((data:DefaultResponseType | ArticleItemType) => {
            if((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message)
            }
            this.article = data as ArticleItemType;

              if (this.article?.id) {
                this.unsubscribeService.sub = this.commentService.getComments(this.article.commentsCount - 3, this.article?.id)
                  .subscribe((data:DefaultResponseType | GetCommentsType) => {
                    if((data as DefaultResponseType).error !== undefined) {
                      throw new Error((data as DefaultResponseType).message)
                    }
                    this.commentaries = data as GetCommentsType;

                  })

                this.unsubscribeService.sub = this.actionsService.getActionsComments(this.article?.id)
                  .subscribe((data:DefaultResponseType | ActionUserArticleType[]) => {
                    if((data as DefaultResponseType).error !== undefined) {
                      throw new Error((data as DefaultResponseType).message)
                    }
                    this.actionsUser = data as ActionUserArticleType[];
                    this.getActionsUser();
                  })
              }
          })

        this.unsubscribeService.sub = this.articleService.getRelatedArticles(params['url'])
          .subscribe((data: DefaultResponseType | ArticleType[]) => {
            if((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message)
            }
            this.relatedArticles = data as ArticleType[];
          })
      })
  }

  public ngOnDestroy(): void {
    this.unsubscribeService.getSub().forEach(s => s.unsubscribe());
  }

  public addComment(): void {
    if (this.formComment.value.comment && this.article?.id) {
      this.unsubscribeService.sub = this.commentService.addComments(this.article?.id, this.formComment.value.comment)
        .subscribe(data => {
            if (data.error) {
              this._snackBar.open(data.message)
              throw new Error(data.message);
            }
            this._snackBar.open(data.message);
            this.formComment.reset();

          if (this.article?.id) {
            this.unsubscribeService.sub = this.commentService.getComments(0, this.article?.id)
              .subscribe(data => {
                this.commentaries = data as GetCommentsType;
              })
          }
           }
       )
    }
  }

  public getComments(): void {
    this.loader = true;
    if (this.article?.commentsCount && this.article.id && this.commentaries.comments) {
      this.unsubscribeService.sub = this.commentService.getComments(this.commentaries.comments.length, this.article?.id)
        .subscribe((data: DefaultResponseType | GetCommentsType) => {
          if((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message)
          }
          this.loader = false;
            (data as GetCommentsType).comments?.forEach((item) => {
              this.commentaries.comments?.push(item);
            })
        })
    }
  }

  public addActions(commentId: string, actions: string): void {
    this.unsubscribeService.sub = this.actionsService.addActions(commentId, actions)
      .subscribe((data: DefaultResponseType) => {

        this._snackBar.open("Ващ голос учтен");

        this.commentaries.comments?.forEach(comment => {
            if (actions === 'like' && commentId === comment.id) {
              if (comment.like) {
                comment.like = false;
                comment.likesCount--;
              } else {
                if (comment.disLike) {
                  comment.disLike = false;
                  comment.dislikesCount--;
                }
                comment.like = true;
                comment.likesCount++;
              }
            } else if (actions === 'dislike' && commentId === comment.id) {
              if (comment.disLike) {
                comment.disLike = false;
                comment.dislikesCount--;
              } else {
                if (comment.like) {
                  comment.like = false;
                  comment.likesCount--;
                }
                comment.disLike = true;
                comment.dislikesCount++;
              }
            }
        })

      })
  }

  public addViolate(commentId: string, action: string): void {
    this.unsubscribeService.sub = this.actionsService.addActions(commentId, action)
      .subscribe({
        next: (data: DefaultResponseType) => {
          this._snackBar.open('Жалоба отправлена');
        },
        error: (error) => {
          this._snackBar.open('Жалоба уже отправлена')
        }
      })
  }


  private getActionsUser(): void {
    this.commentaries.comments?.forEach(comment => {
      this.actionsUser.forEach(action => {
        if (comment.id === action.comment) {
          if (action.action === 'like') {
            comment.like = true;
          }
          if (action.action === 'dislike') {
            comment.disLike = true;
          }
        }
      })
    })
  }
}
