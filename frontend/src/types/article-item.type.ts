import {CommentArticleType} from "./comment-article.type";

export type ArticleItemType = {
  text: string,
  comments: CommentArticleType[],
  commentsCount: number,
  id: string,
  title: string,
  description: string,
  image: string,
  date: string,
  category: string,
  url: string
}
