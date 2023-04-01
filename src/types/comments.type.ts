export type CommentType = {
  id: string;
  text: string;
  date: string;
  likesCount: number;
  dislikesCount: number;
  user: {
    id: string;
    name: string;
  };
  usersAction?:string
};

export type AllCommentsType = {
  allCount: number;
  comments: CommentType[];
};

export type CommetnsParamsType = {
  offset: number;
  article: string;
};

export type CommentsAddType = {
  text: string | any;
  article: string;
};
