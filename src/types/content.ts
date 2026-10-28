export interface ContentImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ArticlePreview {
  title: string;
  href: string;
  image: ContentImage;
  category: string;
  date: string;
  dateTime: string;
  excerpt: string;
  featured?: boolean;
}

export interface EventPreview {
  title: string;
  href?: string;
  image?: ContentImage;
  organizer?: string;
  location: string;
  format?: 'Convegno' | 'Webinar' | 'Seminario';
  description?: string;
  date: { days: string; month: string; year: string; dateTime?: string };
}

export interface DocumentPreview {
  title: string;
  downloadUrl?: string;
  category: string;
  abbreviation: string;
  metadata: string;
  dateTime?: string;
  tone?: 'jurisprudence' | 'international' | 'study';
}

export interface EventDetail extends EventPreview {
  category?: string;
  time?: string;
  cover?: ContentImage;
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
  image?: ContentImage;
  relatedArticle?: { title: string; href: string };
}

export interface MembroTeam {
  nome: string;
  titolo: string;
  ruolo: string;
  immagine?: string;
  descrizione?: string;
  ambito?: string;
  email?: string;
}

export interface SearchResult {
  type: 'page' | 'article' | 'event' | 'document';
  title: string;
  href?: string;
  excerpt?: string;
  category?: string;
  dateTime?: string;
}
