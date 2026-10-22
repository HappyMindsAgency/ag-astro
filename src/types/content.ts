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

export interface DocumentPreview {
  title: string;
  downloadUrl?: string;
  category: string;
  abbreviation: string;
  metadata: string;
}

export interface ArticleDetail extends ArticlePreview {
  author?: TeamMember;
  readingTime?: string;
  editorialNote?: string;
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
