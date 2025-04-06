export interface NewsCategory {
  id: string;
  name: string;
  path: string;
}

export const newsCategories: NewsCategory[] = [
  {
    id: 'latest',
    name: '最新资讯',
    path: 'latest'
  },
  {
    id: 'tech',
    name: '科技新闻',
    path: 'tech'
  },
  {
    id: 'finance',
    name: '财经新闻',
    path: 'finance'
  },
  {
    id: 'society',
    name: '社会新闻',
    path: 'society'
  }
]

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  publishTime: string;
  source: string;
  category: string;
  coverImage?: string;
  author?: string;
  viewCount?: number;
  commentCount?: number;
  credibilityScore?: number;
  likes?: number;
  isLiked?: boolean;
  showComments?: boolean;
  showCommentInput?: boolean;
  newComment?: string;
  commenting?: boolean;
  comments?: Array<{
    id: number;
    username: string;
    avatar: string;
    content: string;
    time: string;
    likes: number;
    isLiked: boolean;
  }>;
} 