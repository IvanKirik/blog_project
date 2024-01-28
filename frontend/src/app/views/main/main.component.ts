import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticleType} from "../../../types/article.type";
import {ArticleService} from "../../shared/services/article.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DefaultResponseType} from "../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UnsubscribeService} from "../../core/unsubscribe/unsubscribe.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {

  public customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    margin: 24,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  };
  public customOptionsRev: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    margin: 24,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 2
      },
      940: {
        items: 3
      }
    },
    nav: false
  };
  public servicesItems = [
    {
      name: 'Создание сайтов',
      description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: 'От 7 500₽',
      img: 'services-1.png',
      defaultOption: false,
    },
    {
      name: 'Продвижение',
      description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: 'От 3 500₽',
      img: 'services-2.png',
      defaultOption: false
    },
    {
      name: 'Реклама',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: 'От 1 000₽',
      img: 'services-3.png',
      defaultOption: false
    },
    {
      name: 'Копирайтинг',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: 'От 750₽',
      img: 'services-4.png',
      defaultOption: false
    }
  ]

  public topArticles: ArticleType[] | null = null;
  private dialogRef: MatDialogRef<any> | null = null;
  @ViewChild('popup') popup!: TemplateRef<ElementRef>;

  constructor(private articleService: ArticleService,
              private dialog: MatDialog,
              private _snackBar: MatSnackBar,
              private unsubscribeService: UnsubscribeService) { }

  public ngOnInit(): void {
   this.unsubscribeService.sub = this.articleService.getBestArticle()
      .subscribe((data: DefaultResponseType | ArticleType[]) => {
        if((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        this.topArticles = data as ArticleType[];
      })
  }

  public ngOnDestroy(): void {
    this.unsubscribeService.getSub().forEach(s => s.unsubscribe());
  }

  public createOrder(servicesName: string): void {
    this.servicesItems.forEach(item => {
      if (item.name === servicesName) {
        item.defaultOption = true;
      }
    })
    this.dialogRef = this.dialog.open(this.popup);
  }

  public closePopup(event: boolean): void {
    if(event) {
      this.dialogRef?.close();
    }
  }
}
