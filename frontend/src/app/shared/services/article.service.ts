import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {ArticleType} from "../../../types/article.type";
import {ArticlesType} from "../../../types/articles.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {ActiveParamsType} from "../../../types/active-params.type";
import {ArticleItemType} from "../../../types/article-item.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  public getBestArticle(): Observable<DefaultResponseType | ArticleType[]> {
    return this.http.get<DefaultResponseType | ArticleType[]>(environment.api + 'articles/top');
  }

  public getArticles(params: ActiveParamsType): Observable<ArticlesType | DefaultResponseType> {
    return this.http.get<ArticlesType | DefaultResponseType>(environment.api + 'articles', {
      params: params
    });
  }

  public getArticle(url: string): Observable<ArticleItemType | DefaultResponseType> {
    return this.http.get<ArticleItemType | DefaultResponseType>(environment.api + 'articles/' + url);
  }

  public getRelatedArticles(url: string): Observable<ArticleType[] | DefaultResponseType> {
    return this.http.get<ArticleType[] | DefaultResponseType>(environment.api + 'articles/related/' + url);
  }



}
