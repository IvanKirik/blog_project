import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {CategoriesType} from "../../../types/categories.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  public getCategories(): Observable<CategoriesType[] | DefaultResponseType> {
    return this.http.get<CategoriesType[] | DefaultResponseType>(environment.api + 'categories')
  }
}
