import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ArticleCardComponent} from "./components/article-card/article-card.component";
import {RouterModule} from "@angular/router";
import { DialogComponent } from './components/dialog/dialog.component';
import {ReactiveFormsModule} from "@angular/forms";
import {IMaskDirectiveModule} from "angular-imask";



@NgModule({
  declarations: [
    ArticleCardComponent,
    DialogComponent,

  ],
    exports: [
        ArticleCardComponent,
        DialogComponent,

    ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    IMaskDirectiveModule
  ]
})
export class SharedModule { }
