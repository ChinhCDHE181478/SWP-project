export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  password?: string;
  role: string;
}

export interface Articles {
  id: number;
  date: string;
  title: string;
  content: string;
  summaryContent: string;
  imageUrl: string;
  articlesType: string;
}

export interface Schedule {
  id: number;
  roundName: string;
  examDate: string;
}
