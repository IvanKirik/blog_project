import {Component, OnDestroy, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ArticlesType} from "../../../../types/articles.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CategoryService} from "../../../shared/services/category.service";
import {CategoriesType} from "../../../../types/categories.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {UnsubscribeService} from "../../../core/unsubscribe/unsubscribe.service";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, OnDestroy {

  public articles!: ArticlesType;
  public categories!: CategoriesType[];
  public sortingOpen: boolean = false;
  public activeParams: ActiveParamsType = {categories: []};
  public appliedFilters: { name: string, urlParam: string }[] = [];
  public pages: number[] = [];

  constructor(private articleService: ArticleService,
              private categoryService: CategoryService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private unsubscribeService: UnsubscribeService) { }

  public ngOnInit(): void {
    this.unsubscribeService.sub = this.categoryService.getCategories()
      .subscribe((data: CategoriesType[] | DefaultResponseType) => {
        if((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        this.categories = data as CategoriesType[];

        this.unsubscribeService.sub = this.activatedRoute.queryParams
          .subscribe(params => {
          const activeParams: ActiveParamsType = {
            categories: []
          }
          if (params.hasOwnProperty('categories')) {
            activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
          }
            if (params.hasOwnProperty('page')) {
              activeParams.page = +params['page'];
            } else {
              activeParams.page = 1;
            }

          this.activeParams = activeParams;
          this.activeParams.categories = activeParams['categories'];
          this.activeParams.page = activeParams['page'];

          this.appliedFilters = [];
          this.activeParams.categories?.forEach(url => {
            this.categories.forEach(item => {
              if (url === item.url) {
                this.appliedFilters.push({
                  name: item.name,
                  urlParam: url
                })
              }

            })
          })

            this.unsubscribeService.sub = this.articleService.getArticles(this.activeParams)
                .subscribe((data: ArticlesType | DefaultResponseType) => {
                  if((data as DefaultResponseType).error !== undefined) {
                    throw new Error((data as DefaultResponseType).message)
                  }
                  if (data as ArticlesType) {
                    this.pages = [];
                    for (let i = 1; i <= (data as ArticlesType).pages; i++) {
                      this.pages.push(i);
                    }
                    this.articles = data as ArticlesType;
                  }
            })
        })
      })
  }

  public ngOnDestroy(): void {
    this.unsubscribeService.getSub().forEach(s => s.unsubscribe());
  }

  public toggleSorting():void {
    this.sortingOpen = !this.sortingOpen;
  }

  public updateSorting(url: string, checked: boolean): void {
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingTypeInParams = this.activeParams.categories.find(item => item === url);
      if (existingTypeInParams && !checked) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url);
      } else if (!existingTypeInParams && checked) {
        this.activeParams.categories = [...this.activeParams.categories, url];
      }
    } else if (checked) {
      this.activeParams.categories = [url];
    }
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    })
  }

  public removeAppliedFilter(appliedFilter: { name: string; urlParam: string }) {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.urlParam)
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    })

  }

  public openPage(page: number): void {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    })
  }

  public openNextPage(): void {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++
        this.router.navigate(['/blog'], {
          queryParams: this.activeParams
        })
    }
  }
  public openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      })
    }
  }

}
