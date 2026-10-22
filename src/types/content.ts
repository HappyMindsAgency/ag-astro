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

export interface TeamMember {
  firstName: string;
  lastName?: string;
  role?: string;
  biography?: string;
  expertise?: string;
  email?: string;
  image?: { src: string; alt: string; width: number; height: number };
  relatedArticle?: { title: string; href: string };
}
