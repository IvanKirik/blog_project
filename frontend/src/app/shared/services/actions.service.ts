import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";
import {ActionUserArticleType} from "../../../types/action-user-article.type";

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  constructor(private http: HttpClient) { }

  public getActions(articleId: string): Observable<any> {
    return this.http.get<any>(environment.api + 'comments/article-comment-actions', {
      params: {articleId}
    })
  }

  public addActions(commentId: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {
        action
    })
  }

  public getActionsComments(articleId: string): Observable<DefaultResponseType | ActionUserArticleType[]> {
    return this.http.get<DefaultResponseType | ActionUserArticleType[]>(environment.api + 'comments/article-comment-actions', {
      params: {articleId}
    })
  }
}
