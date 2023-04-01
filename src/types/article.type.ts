export type ArticleType = {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  url: string;
};

export type ArticleDetailsType = {
  text?: HTMLElement;
  comments: [];
  commentsCount: number;
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  url: string;
};
