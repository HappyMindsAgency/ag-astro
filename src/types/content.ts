export interface ArticlePreview {
  title: string;
  href: string;
  image: { src: string; alt: string; width: number; height: number };
  category: string;
  date: string;
  dateTime: string;
  excerpt: string;
  featured?: boolean;
}
