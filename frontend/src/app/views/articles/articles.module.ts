import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';
import { BlogComponent } from './blog/blog.component';
import {SharedModule} from "../../shared/shared.module";
import { ArticleComponent } from './article/article.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    BlogComponent,
    ArticleComponent
  ],
    imports: [
        CommonModule,
        ArticlesRoutingModule,
        SharedModule,
        ReactiveFormsModule
    ]
})
export class ArticlesModule { }
