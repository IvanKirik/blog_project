import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {GetCommentsType} from "../../../types/get-comments.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  public addComments(article: string, text: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text, article
    })
  }

  public getComments(offset: number, article: string): Observable<GetCommentsType | DefaultResponseType> {
    return this.http.get<GetCommentsType | DefaultResponseType>(environment.api + 'comments', {
      params: {offset, article}
    })
  }
}
